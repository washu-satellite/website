"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, Radio, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import TicketClaim, { LAUNCH_WINDOW } from "@/components/space/TicketClaim";

/**
 * TEMPORARY CAMPAIGN PAGE. Live for the SCALAR launch push; retire it once the launch has flown.
 * Removing it is three edits: delete this file, drop the "Go to space" link from NavBar, and delete
 * src/components/space/. The signup API and the boarding-pass renderer are shared with the unlisted
 * /9njdxq3e prototype, so leave those in place.
 */

export const Route = createFileRoute("/space")({
  head: () => ({
    meta: [
      { title: "Want to go to space? | WashU Satellite" },
      {
        name: "description",
        content:
          "WashU Satellite is sending SCALAR, a 1U CubeSat, to orbit in January 2027. Add your name and we will engrave it on the spacecraft. Free, open to anyone.",
      },
      { property: "og:title", content: "Want to go to space?" },
      {
        property: "og:description",
        content:
          "Add your name to SCALAR before it launches, and take a boarding pass.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpacePage,
});

const STEPS = [
  {
    icon: Rocket,
    title: "Put your name down",
    body: "Anyone, anywhere. You do not have to go to WashU, and it does not cost anything.",
  },
  {
    icon: Mail,
    title: "Take your boarding pass",
    body: "Download it as a PDF or an image. Print it, frame it, or put it on your story.",
  },
  {
    icon: Radio,
    title: "Follow it up",
    body: `We email you when SCALAR ships, when it launches in ${LAUNCH_WINDOW}, and when it first calls home.`,
  },
];

const LINKS = [
  {
    to: "/projects/scalar",
    label: "Meet SCALAR",
    body: "The 1U CubeSat you are buying a ticket on.",
  },
  {
    to: "/apply",
    label: "Join the team",
    body: "WashU students: build the next one with us.",
  },
  {
    to: "/newsletters",
    label: "Read the newsletter",
    body: "What we have been building, in our own words.",
  },
];

function SpacePage() {
  return (
    <div className="flex-1">
      <div className="fixed top-0 h-full w-full bg-bg-blue" />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-end overflow-hidden"
      >
        {/* The frame is white linework on transparency, drawn for a dark page. Inverting it in
            light mode turns those strokes black rather than leaving them invisible. */}
        <img
          src="/frames/scalar/f_0025.webp"
          alt=""
          className="w-[45rem] max-w-[85vw] max-h-[70vh] translate-x-[12%] object-contain opacity-40 invert dark:opacity-55 dark:invert-0"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div
        className={cn(
          "border-t border-border bg-transparent",
          // The backdrop is anchored off the right edge and is barely visible on a phone, so the
          // tall offset it exists to make room for is only paid from md up.
          "mt-[13rem] md:mt-[20rem] px-4 pb-[4rem]",
          "relative z-10 flex flex-col items-center justify-center gap-10 md:gap-16",
        )}
      >
        <div className="dots-header absolute top-1 z-0 h-[8rem] w-full bg-repeat-x opacity-60" />

        <div className="z-10 -mt-[9rem] md:-mt-[10rem] flex w-full min-w-0 max-w-[40rem] flex-col items-center gap-8 rounded-md border-[1px] border-inherit bg-background p-6 sm:p-8 md:min-w-[30rem]">
          {/* Sized down from the site's usual 5xl/6xl title: this one is a full question rather
              than a one-word page name, and at 6xl it wrapped to four lines on a phone. */}
          <h1 className="text-center font-mono text-3xl font-semibold uppercase text-accent-red sm:text-4xl md:text-5xl">
            Want to go to space?
          </h1>

          <p className="text-center text-foreground/80">
            WashU Satellite is sending{" "}
            <span className="font-medium text-foreground">SCALAR</span>, a 1U
            CubeSat, to orbit in {LAUNCH_WINDOW}. Add your name below and we
            will engrave it on the spacecraft before it ships.
          </p>

          <TicketClaim />
        </div>

        <div className="relative w-full">
          <div className="mx-auto flex w-full max-w-[60rem] flex-col gap-10 px-0 py-8 md:px-[4rem]">
            <section className="flex flex-col gap-4">
              <h2 className="font-mono text-xs uppercase tracking-wider text-foreground/60">
                How this works
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {STEPS.map(({ icon: Icon, title, body }, index) => (
                  <div
                    key={title}
                    className="flex flex-col gap-3 rounded-md border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-md border border-border p-1">
                        <Icon aria-hidden className="h-4 w-4" />
                      </div>
                      <span className="font-mono text-xs uppercase tracking-wider text-foreground/60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-sans font-medium">{title}</h3>
                    <p className="text-sm text-foreground/80">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-mono text-xs uppercase tracking-wider text-foreground/60">
                While you are here
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {LINKS.map(({ to, label, body }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex flex-col gap-2 rounded-md border border-border bg-background p-4 transition-colors hover:bg-bg-highlight"
                  >
                    <span className="flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-wider">
                      {label}
                      <ArrowRight
                        aria-hidden
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[3px]"
                      />
                    </span>
                    <span className="text-sm text-foreground/80">{body}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
