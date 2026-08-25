import { createFileRoute } from "@tanstack/react-router";
import {
  signupRequestSchema,
  type SignupEntry,
} from "@/lib/ticket/signupSchema";
import {
  getSignupStore,
  storageUnavailable,
  type SignupStore,
} from "@/lib/ticket/signups";

/** Injectable so tests can drive the handler against a stub without touching the store. */
export async function handleSignup(
  request: Request,
  store: SignupStore,
): Promise<Response> {
  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  // Checked before the body is even read, so this costs nothing and, just as usefully, a malformed
  // request can tell you whether storage is wired up without writing a row to find out.
  if (storageUnavailable()) {
    console.error("signup route: BLOB_READ_WRITE_TOKEN is not set; refusing to accept signups");
    return json(
      {
        error:
          "Signups are temporarily unavailable. Please try again later.",
      },
      503,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (err) {
    console.error("signup route: request body was not JSON", { err });
    return json({ error: "Request body must be JSON." }, 400);
  }

  const parsed = signupRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid name.";
    console.error("signup route: validation failed", { body, message });
    return json({ error: message }, 400);
  }

  const entry: SignupEntry = {
    name: parsed.data.name,
    ...(parsed.data.email ? { email: parsed.data.email } : {}),
    newsletter: parsed.data.newsletter ?? false,
    source: parsed.data.source ?? "ticket",
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? "unknown",
  };

  try {
    await store.append(entry);
  } catch (err) {
    // Full detail to the logs, where it is diagnosable. The visitor gets the plain version: storage
    // failures are our problem, and the underlying message is a bundler stack trace, not advice.
    console.error("signup route: could not persist signup", { entry, err });
    return json(
      { error: "Signups are temporarily unavailable. Please try again later." },
      503,
    );
  }

  console.log("signup route: saved", {
    name: entry.name,
    source: entry.source,
    hasEmail: entry.email !== undefined,
    newsletter: entry.newsletter,
    at: entry.timestamp,
  });
  return json({ ok: true, name: entry.name }, 201);
}

export const Route = createFileRoute("/api/ticket-signup")({
  server: {
    handlers: {
      POST: ({ request }) => handleSignup(request, getSignupStore()),
    },
  },
});
