import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  INFO_SESSIONS,
  SESSION_DATE,
  SESSION_LOCATION,
} from "@/const/content/infoSessions";

/**
 * TEMPORARY and UNLISTED. Nothing on the site links here; it is meant to be handed out as a URL or
 * a QR code at the activities fair. It stays out of search results so it does not outlive the day
 * it describes, but it is otherwise a normal page with the usual chrome.
 *
 * Retire it after 30 August 2026: delete this file and src/const/content/infoSessions.ts.
 */
export const Route = createFileRoute("/info-sessions")({
  head: () => ({
    meta: [
      { title: "Design Team Info Sessions | WashU Satellite" },
      {
        name: "description",
        content: `Coordinated first info sessions for WashU engineering design teams, ${SESSION_DATE} in ${SESSION_LOCATION}.`,
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InfoSessionsPage,
});

function InfoSessionsPage() {
  return (
    <div className="flex-1">
      <div className="fixed top-0 h-full w-full bg-bg-blue" />

      <div
        className={cn(
          "border-t border-border bg-bg",
          "mt-[13rem] px-4 pb-[4rem]",
          "relative z-10 flex flex-col items-center justify-center gap-10 md:gap-16",
        )}
      >
        <div className="dots-header absolute top-1 z-0 h-[8rem] w-full bg-repeat-x opacity-60" />

        <div className="z-10 -mt-[9rem] flex w-full min-w-0 max-w-[40rem] flex-col items-center gap-6 rounded-md border-[1px] border-inherit bg-background p-6 sm:p-8 md:min-w-[30rem]">
          <h1 className="text-center font-mono text-3xl font-semibold uppercase text-accent-red sm:text-4xl md:text-5xl">
            Info Sessions
          </h1>

          <p className="text-center text-foreground/80">
            Every engineering design team, back to back, in one room. Drop in
            for the ones you care about or stay for all of them.
          </p>

          <div className="flex flex-col items-center gap-2 font-mono text-sm uppercase tracking-wider text-foreground/70 sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2">
              <Clock aria-hidden className="h-4 w-4" />
              {SESSION_DATE}
            </span>
            <span className="flex items-center gap-2">
              <MapPin aria-hidden className="h-4 w-4" />
              {SESSION_LOCATION}
            </span>
          </div>
        </div>

        <div className="relative w-full">
          <div className="mx-auto flex w-full max-w-[48rem] flex-col gap-2 py-2">
            {INFO_SESSIONS.map((session) => (
              <div
                key={`${session.start}-${session.team}`}
                className={cn(
                  "flex flex-col gap-1 rounded-md border p-4",
                  "sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                  session.break
                    ? "border-dashed border-border bg-transparent"
                    : "border-border bg-background",
                  session.ours && "border-accent-red",
                )}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                  <span
                    className={cn(
                      "font-mono text-sm uppercase tracking-wider tabular-nums",
                      session.ours ? "text-accent-red" : "text-foreground/60",
                    )}
                  >
                    {session.label}
                  </span>
                  <span
                    className={cn(
                      "font-sans text-lg font-medium",
                      session.break && "text-foreground/60",
                    )}
                  >
                    {session.team}
                  </span>
                </div>

                {session.instagram && (
                  <a
                    href={session.instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${session.team} on Instagram`}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-md border border-border px-3 py-1.5",
                      "font-mono text-xs uppercase tracking-wider text-foreground/80",
                      "transition-colors hover:bg-bg-highlight hover:text-foreground",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-red",
                    )}
                  >
                    <Instagram aria-hidden className="h-4 w-4" />
                    Instagram
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
