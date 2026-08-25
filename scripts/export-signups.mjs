/**
 * Prints every ticket signup as CSV.
 *
 * Two ways in, because the Blob token and the deployed site do not always live in the same place:
 *   BLOB_READ_WRITE_TOKEN=...  node scripts/export-signups.mjs            (reads Blob directly)
 *   SIGNUP_EXPORT_TOKEN=... SITE=https://www.washusatellite.com \
 *                            node scripts/export-signups.mjs             (reads the live site)
 *
 * `vercel env pull` will fetch either token if you have access to the project.
 */
import { list, get } from "@vercel/blob";

const PREFIX = "ticket-signups/";

function csvCell(value) {
  const text = value === undefined || value === null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(entries) {
  const header = "name,email,newsletter,source,timestamp";
  const rows = entries.map((e) =>
    [e.name, e.email, e.newsletter ?? false, e.source ?? "ticket", e.timestamp]
      .map(csvCell)
      .join(","),
  );
  return [header, ...rows].join("\r\n");
}

async function fromBlob() {
  const { blobs } = await list({ prefix: PREFIX });
  console.error(`export-signups: found ${blobs.length} signup blobs`);

  const entries = await Promise.all(
    blobs.map(async (blob) => {
      try {
        const result = await get(blob.pathname, { access: "private" });
        if (!result) throw new Error("blob not found");
        return JSON.parse(await new Response(result.stream).text());
      } catch (err) {
        // One unreadable blob should not cost you the rest of the export.
        console.error(`export-signups: skipping ${blob.pathname}`, err);
        return null;
      }
    }),
  );

  return entries
    .filter(Boolean)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

async function fromSite(site, token) {
  const url = new URL("/api/ticket-signups?format=json", site);
  console.error(`export-signups: fetching ${url.origin}${url.pathname}`);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `${url.origin}${url.pathname} replied ${response.status}. ${body.slice(0, 200)}`,
    );
  }
  return (await response.json()).entries;
}

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
const exportToken = process.env.SIGNUP_EXPORT_TOKEN;
const site = process.env.SITE ?? "https://www.washusatellite.com";

try {
  const entries = blobToken
    ? await fromBlob()
    : exportToken
      ? await fromSite(site, exportToken)
      : null;

  if (entries === null) {
    console.error(
      "export-signups: set BLOB_READ_WRITE_TOKEN (reads Blob directly) or SIGNUP_EXPORT_TOKEN (reads the live site).",
    );
    process.exit(1);
  }

  console.error(`export-signups: ${entries.length} signups`);
  console.log(toCsv(entries));
} catch (err) {
  console.error("export-signups: failed", err);
  process.exit(1);
}
