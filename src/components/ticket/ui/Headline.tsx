import { useEffect, useRef } from "react";
import { beat, easeInOutCubic } from "@/lib/ticket/beats";
import { useScrollSequence } from "@/lib/ticket/scroll";

/**
 * PLACEHOLDER COPY. Deliberately not "1 ticket to space" -- that line belongs to the ticket and
 * must not be spent twice. This sets up the envelope as something addressed to the viewer so the
 * ticket's line lands as the reveal.
 */
export function Headline() {
  const root = useRef<HTMLDivElement>(null);
  const { progress, reducedMotion } = useScrollSequence();

  // Driven by rAF straight onto the node: this reads scroll progress every frame and must not
  // re-render React while the 3D scene is running.
  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const tick = () => {
      const el = root.current;
      if (el) {
        const p = progress.current.current;
        const out = easeInOutCubic(beat(p, "descent"));
        el.style.opacity = String(1 - out);
        el.style.transform = `translate3d(0, ${-out * 90}px, 0)`;
        el.style.visibility = out >= 0.999 ? "hidden" : "visible";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-full flex-col items-center justify-between px-6 py-[8vh] text-center"
    >
      <div>
        <p className="text-[11px] uppercase tracking-[0.5em] text-amber-200/60">
          One of one
        </p>
        <h1 className="mt-6 text-[clamp(2.6rem,7vw,5.6rem)] font-semibold leading-[0.94] tracking-[-0.03em] text-white">
          You have been
          <br />
          selected.
        </h1>
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.42em] text-white/45">
          Scroll to open
        </span>
        <span className="scroll-hint block h-12 w-px bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </div>
  );
}
