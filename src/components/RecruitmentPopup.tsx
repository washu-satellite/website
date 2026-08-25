import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Recruitment dates, in US Central with an explicit offset so a visitor in
 * another timezone sees the same cutoff we do. `endsAt` is when the item stops
 * being useful, not when it starts: an event mid-way through should still show.
 *
 * Bump the offset to -06:00 for anything after Nov 1, when Central leaves DST.
 */
type RecruitmentEvent = {
  date: string;
  day: string;
  title: string;
  detail: string;
  endsAt: string;
};

const EVENTS: RecruitmentEvent[] = [
  {
    date: "8/28",
    day: "Friday",
    title: "SU Activities Fair",
    detail: "Mudd Field · 3–5pm",
    endsAt: "2026-08-28T17:00:00-05:00",
  },
  {
    date: "8/30",
    day: "Sunday",
    title: "Info Session",
    detail: "Lopata 101 · 5–6pm",
    endsAt: "2026-08-30T18:00:00-05:00",
  },
  {
    date: "9/4",
    day: "Friday",
    title: "Applications due",
    detail: "washusatellite.com/apply",
    endsAt: "2026-09-04T23:59:00-05:00",
  },
  {
    date: "9/4–13",
    day: "Interviews",
    title: "Interview period",
    detail: "We'll reach out to schedule",
    endsAt: "2026-09-13T23:59:00-05:00",
  },
  {
    date: "9/15",
    day: "Tuesday",
    title: "Decisions released",
    detail: "Same day as every design team",
    endsAt: "2026-09-15T23:59:00-05:00",
  },
];

const DISMISS_KEY = "wusat-recruitment-popup-dismissed-2026f";

export default function RecruitmentPopup() {
  // Rendered only after mount. Date filtering on the server and on the client
  // can disagree, and a hydration mismatch on the root layout is not worth the
  // few hundred milliseconds this costs.
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const upcoming = useMemo(
    () => EVENTS.filter((e) => new Date(e.endsAt).getTime() > Date.now()),
    [mounted],
  );

  useEffect(() => {
    setMounted(true);
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch (err) {
      // Safari private mode throws on localStorage. Showing the popup twice is
      // better than the popup never appearing.
      console.error("recruitment popup: localStorage read failed", err);
    }
    if (!dismissed) setOpen(true);
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch (err) {
      console.error("recruitment popup: localStorage write failed", err);
    }
  }

  // Nothing left to advertise once the last date passes, so the whole thing
  // retires itself rather than sitting there with stale dates on it.
  if (!mounted || !open || upcoming.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recruitment-popup-title"
    >
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={dismiss}
      />
      <div
        className={cn(
          "relative w-full max-w-md rounded-lg border border-border bg-background shadow-xl",
          "max-h-[85vh] overflow-y-auto",
        )}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-1 text-text-dark hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-red"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 text-accent-red">
            <CalendarDays aria-hidden className="h-4 w-4" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold">
              Recruitment is open
            </span>
          </div>
          <h2
            id="recruitment-popup-title"
            className="mt-2 text-2xl font-bold leading-tight text-text"
          >
            We're recruiting for Fall 2026
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            All majors, all years, no experience needed. Come find us at one of
            these, or apply straight away.
          </p>
        </div>

        <ul className="border-t border-border">
          {upcoming.map((event) => (
            <li
              key={event.title}
              className="flex gap-4 border-b border-border px-6 py-3 last:border-b-0"
            >
              <div className="w-16 shrink-0">
                <div className="font-bold leading-tight text-text">{event.date}</div>
                <div className="text-[11px] uppercase tracking-wide text-text-dark">
                  {event.day}
                </div>
              </div>
              <div className="min-w-0">
                <div className="font-semibold leading-tight text-accent-red">
                  {event.title}
                </div>
                <div className="text-sm text-text-secondary">{event.detail}</div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 p-6 pt-4 sm:flex-row sm:items-center">
          <Link
            to="/apply"
            onClick={dismiss}
            className={cn(
              "group inline-flex items-center justify-center gap-2 rounded-md",
              "px-4 py-2 font-mono text-sm uppercase tracking-wider font-semibold",
              "bg-accent-red hover:bg-accent-red-hover text-white",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              "focus-visible:outline-accent-red transition-all duration-300",
            )}
          >
            Apply
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[3px]"
            />
          </Link>
          <button
            onClick={dismiss}
            className="px-2 py-2 text-sm text-text-dark hover:text-text"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
