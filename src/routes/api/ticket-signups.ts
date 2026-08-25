import { createFileRoute } from "@tanstack/react-router";
import type { SignupEntry } from "@/lib/ticket/signupSchema";
import { getSignupStore, type SignupStore } from "@/lib/ticket/signups";

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
  store: SignupStore,
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

  let entries: SignupEntry[];
  try {
    entries = await store.list();
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
        handleExport(request, getSignupStore(), process.env.SIGNUP_EXPORT_TOKEN),
    },
  },
});
