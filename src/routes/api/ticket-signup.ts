import { createFileRoute } from "@tanstack/react-router";
import {
  signupRequestSchema,
  type SignupEntry,
} from "@/lib/ticket/signupSchema";
import { getSignupStore, type SignupStore } from "@/lib/ticket/signups";

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
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? "unknown",
  };

  try {
    await store.append(entry);
  } catch (err) {
    // The store already names the key and operation; surface that rather than a generic 500.
    console.error("signup route: could not persist signup", { entry, err });
    return json(
      {
        error:
          err instanceof Error
            ? `Could not save your name: ${err.message}`
            : "Could not save your name.",
      },
      500,
    );
  }

  console.log("signup route: saved", { name: entry.name, at: entry.timestamp });
  return json({ ok: true, name: entry.name }, 201);
}

export const Route = createFileRoute("/api/ticket-signup")({
  server: {
    handlers: {
      POST: ({ request }) => handleSignup(request, getSignupStore()),
    },
  },
});
