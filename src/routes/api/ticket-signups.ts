import { createFileRoute } from "@tanstack/react-router";
import type { SignupEntry } from "@/lib/ticket/signupSchema";
import type { SignupStore } from "@/lib/ticket/signups";

/**
 * Reads back everyone who has claimed a ticket. These rows are names and email addresses, so the
 * route refuses to answer without the shared secret and refuses to exist at all if that secret was
 * never configured -- an export that silently opens to the public is worse than no export.
 *
 * The token goes in the Authorization header rather than the query string: URLs end up in browser
 * history, proxy logs and Referer headers, and a credential does not belong in any of them.
 */
const HEADER_PREFIX = "Bearer ";

/** Comparison that does not return early, so a wrong token leaks nothing through response timing. */
function secretsMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function csvCell(value: string | boolean | undefined): string {
  const text = value === undefined ? "" : String(value);
  // Escape per RFC 4180. Names really do contain commas, and Excel splits on them.
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(entries: SignupEntry[]): string {
  const header = "name,email,newsletter,source,timestamp";
  const rows = entries.map((e) =>
    [
      csvCell(e.name),
      csvCell(e.email),
      csvCell(e.newsletter ?? false),
      csvCell(e.source ?? "ticket"),
      csvCell(e.timestamp),
    ].join(","),
  );
  return [header, ...rows].join("\r\n");
}

/** Injectable so the auth and formatting can be exercised without a live Blob store. */
export async function handleExport(
  request: Request,
  // Loaded on demand, not imported. @vercel/blob drags in @vercel/oidc, which calls require() from
  // inside an ES module and throws at import time on any host that is not Vercel itself. Keeping it
  // behind a dynamic import means an unauthenticated or unconfigured request answers cleanly
  // instead of dying while the module graph loads.
  openStore: () => Promise<SignupStore>,
  secret: string | undefined,
): Promise<Response> {
  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });

  if (!secret) {
    console.error("signups export: SIGNUP_EXPORT_TOKEN is not set; refusing to export");
    return json(
      { error: "Export is not configured. Set SIGNUP_EXPORT_TOKEN and redeploy." },
      503,
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const supplied = header.startsWith(HEADER_PREFIX)
    ? header.slice(HEADER_PREFIX.length).trim()
    : "";

  if (!secretsMatch(supplied, secret)) {
    console.error("signups export: rejected a request", {
      hadHeader: header.length > 0,
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });
    return json({ error: "Unauthorized." }, 401);
  }

  const diagnose = new URL(request.url).searchParams.get("diagnose");
  if (diagnose === "1" || diagnose === "write") {
    // Deliberately ahead of the store read. Reading is exactly what breaks when storage is
    // misconfigured, and a diagnostic that needs the broken call to succeed first tells you nothing.
    // Names only, never values.
    let readCheck: string;
    try {
      readCheck = `ok, ${(await (await openStore()).list()).length} entries`;
    } catch (err) {
      readCheck = err instanceof Error ? err.message : String(err);
    }

    // ?diagnose=write additionally attempts a real append, because a store can be perfectly
    // readable and still reject writes, and the visitor-facing error is deliberately vague.
    let writeCheck: string | undefined;
    if (new URL(request.url).searchParams.get("diagnose") === "write") {
      try {
        await (await openStore()).append({
          name: "ZZ Storage Probe",
          email: "storage-probe@washusatellite.com",
          newsletter: false,
          source: "space",
          timestamp: new Date().toISOString(),
          userAgent: "diagnostic",
        });
        writeCheck = "ok";
      } catch (err) {
        writeCheck = err instanceof Error ? err.message : String(err);
      }
    }

    return json(
      {
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "unknown",
        onVercel: Boolean(process.env.VERCEL),
        hasBlobReadWriteToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
        blobRelatedEnvNames: Object.keys(process.env).filter((key) =>
          /BLOB|READ_WRITE_TOKEN/i.test(key),
        ),
        readCheck,
        ...(writeCheck === undefined ? {} : { writeCheck }),
      },
      200,
    );
  }

  let entries: SignupEntry[];
  try {
    entries = await (await openStore()).list();
  } catch (err) {
    console.error("signups export: could not read the store", { err });
    return json(
      {
        error:
          err instanceof Error
            ? `Could not read signups: ${err.message}`
            : "Could not read signups.",
      },
      500,
    );
  }

  console.log("signups export: served", { count: entries.length });

  const format = new URL(request.url).searchParams.get("format");
  if (format === "json") {
    return json({ count: entries.length, entries }, 200);
  }

  return new Response(toCsv(entries), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="washu-satellite-signups.csv"',
      "Cache-Control": "no-store",
    },
  });
}

export const Route = createFileRoute("/api/ticket-signups")({
  server: {
    handlers: {
      GET: ({ request }) =>
        handleExport(
          request,
          async () => (await import("@/lib/ticket/signups")).getSignupStore(),
          process.env.SIGNUP_EXPORT_TOKEN,
        ),
    },
  },
});
