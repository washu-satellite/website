import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Experience from "@/components/ticket/Experience";
import "@/components/ticket/ticket.css";

/**
 * An unlisted page: nothing links to it, and it is deliberately kept out of search results. It is a
 * gift meant to be handed over as a URL, not found.
 */
export const Route = createFileRoute("/9njdxq3e")({
  head: () => ({
    meta: [
      { title: "1 Ticket to Space" },
      {
        name: "description",
        content: "An invitation, sealed and addressed to you.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TicketPage,
});

function TicketPage() {
  // react-three-fiber needs a real canvas and a WebGL context, neither of which exists during SSR,
  // and the scene reads window on mount. Rendering only after the client has mounted keeps the
  // server pass to a plain backdrop rather than throwing through the whole route.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Overscroll has to be suppressed on the scrolling element itself, which is the document, not this
  // container -- a nested rule simply never applies. Without it the rubber-band at either end fights
  // the sequence, and on iOS it lifts the pinned canvas away from the viewport edge. Restored on
  // unmount so the rest of the site keeps its normal bounce.
  useEffect(() => {
    const { documentElement: root, body } = document;
    const previous = [root.style.overscrollBehaviorY, body.style.overscrollBehaviorY];
    root.style.overscrollBehaviorY = "none";
    body.style.overscrollBehaviorY = "none";
    return () => {
      root.style.overscrollBehaviorY = previous[0];
      body.style.overscrollBehaviorY = previous[1];
    };
  }, []);

  return (
    <main className="ticket-root relative min-h-screen w-full bg-[#03020a]">
      {mounted ? <Experience /> : null}
    </main>
  );
}
