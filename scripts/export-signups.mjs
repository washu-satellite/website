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
import { readFileSync } from "node:fs";

const PREFIX = "ticket-signups/";

/**
 * Reads .env.local before anything else, so the token lives in a gitignored file rather than in
 * shell history or in whoever-is-asking's clipboard. Missing file is the normal case in CI.
 */
function loadEnvFile(path) {
  let contents;
  try {
    contents = readFileSync(path, "utf8");
  } catch (err) {
    if (err.code !== "ENOENT") console.error(`export-signups: could not read ${path}`, err);
    return;
  }

  for (const line of contents.split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "");
  }
}

loadEnvFile(new URL("../.env.local", import.meta.url));

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

const exportToken = process.env.SIGNUP_EXPORT_TOKEN;
const site = process.env.SITE ?? "https://www.washusatellite.com";

try {
  if (!exportToken) {
    console.error(
      "export-signups: no SIGNUP_EXPORT_TOKEN. Put it in .env.local (gitignored) or pass it inline.",
    );
    process.exit(1);
  }

  const entries = await fromSite(site, exportToken);

  console.error(`export-signups: ${entries.length} signups`);
  console.log(toCsv(entries));
} catch (err) {
  console.error("export-signups: failed", err);
  process.exit(1);
}
