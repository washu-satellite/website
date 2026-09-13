import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * /sponsors moved to /partners. Kept as a redirect rather than deleted: the old
 * URL is in sent emails to companies we are still talking to, and a 404 there
 * is a bad first impression from a sponsor pitch.
 */
export const Route = createFileRoute("/sponsors")({
  beforeLoad: () => {
    throw redirect({ to: "/partners", replace: true });
  },
});
