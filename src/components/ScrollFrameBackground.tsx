import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BG_POSITION, type BgPosition } from "@/components/GenericPage";

export type FrameSequence = {
  /** Directory under /public holding f_0001.webp … */
  dir: string;
  count: number;
  /**
   * Width / height of the frames. Frames are cropped to the model's bounds so
   * this is not 16:9 — hardcoding an aspect would letterbox and shrink them.
   */
  aspect: number;
  /**
   * Native pixel width of a frame. The canvas never renders wider than this —
   * upscaling past it is what made the first pass look soft.
   */
  width: number;
  /** Where the backdrop sits horizontally. Matches GenericPage's positions. */
  position?: BgPosition;
  /**
   * Line colour. Defaults to the crimson the models are drawn in. Not read
   * from `text-accent-red` — that class is used across the site but is never
   * actually defined, so it resolves to the inherited foreground.
   */
  tint?: string;
};

function frameSrc(dir: string, i: number) {
  return `${dir}/f_${String(i + 1).padStart(4, "0")}.webp`;
}

/**
 * Scroll-scrubbed exploded-view backdrop. Page scroll position maps to a frame
 * of the Blender render, so scrolling drives the assembly apart and back.
 *
 * Frames are drawn to a canvas rather than swapped as <img> src, because
 * swapping src causes a decode-and-flash on every step; the canvas holds the
 * last good frame until the next one is ready.
 */
export default function ScrollFrameBackground({
  dir,
  count,
  aspect,
  width,
  position = "right",
  tint = "#b33c3c",
}: FrameSequence) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const rafId = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  // Load every frame, but in small batches. Firing 120 requests at once
  // starves the rest of the page on a cold load; loading strictly in order
  // means an early scroll has nothing to draw. Batching splits the difference.
  useEffect(() => {
    frames.current = new Array(count).fill(null);
    // Navigating between two project pages reuses this component, so the new
    // sequence has to reset `ready`. Without it, `ready` is still true from the
    // previous project, setReady(true) below is a no-op, the draw effect never
    // re-fires, and the old model stays on screen until the visitor scrolls.
    setReady(false);
    // Wipe the previous model rather than leaving it up while the new frames
    // download — showing the wrong spacecraft is worse than showing none.
    const el = canvas.current;
    el?.getContext("2d")?.clearRect(0, 0, el.width, el.height);

    let cancelled = false;
    const CONCURRENCY = 6;
    let next = 0;

    const loadOne = (index: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) frames.current[index] = img;
          resolve();
        };
        img.onerror = () => {
          console.error("timeline frame failed to load", {
            src: frameSrc(dir, index),
          });
          resolve();
        };
        img.src = frameSrc(dir, index);
      });

    const pump = async (): Promise<void> => {
      while (!cancelled && next < count) {
        const index = next++;
        await loadOne(index);
        if (index === 0 && !cancelled) setReady(true);
      }
    };

    Promise.all(Array.from({ length: CONCURRENCY }, pump)).catch((err) =>
      console.error("frame preload failed", { dir, err }),
    );

    return () => {
      cancelled = true;
    };
  }, [dir, count]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;

    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;

    const draw = () => {
      rafId.current = null;
      const ctx = el.getContext("2d");
      if (!ctx) return;

      const scrollable = document.body.scrollHeight - window.innerHeight;
      const progress =
        reduced || scrollable <= 0
          ? 0.5
          : Math.min(1, Math.max(0, window.scrollY / scrollable));

      // Keep the fractional position: the pair of frames either side of it get
      // cross-faded, so motion stays continuous instead of snapping frame to
      // frame as you scroll.
      const exact = progress * (count - 1);
      const lower = Math.floor(exact);
      const blend = exact - lower;

      const nearest = (from: number) => {
        const at = frames.current[from];
        if (at) return at;
        // Fall back to the nearest already-loaded frame so early scrolling
        // still moves instead of freezing on frame 0.
        for (let step = 1; step < count; step++) {
          const hit = frames.current[from - step] ?? frames.current[from + step];
          if (hit) return hit;
        }
        return null;
      };

      const img = nearest(lower);
      if (!img) return;
      const next = blend > 0 ? frames.current[lower + 1] : null;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = el.clientWidth * dpr;
      const h = el.clientHeight * dpr;
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
      }
      // Frames ship as white line art on transparent — a plain lossy render of
      // the red wireframe costs ~4x the bytes for the same result. Tint here
      // with source-in so the lines pick up the site's accent colour.
      ctx.clearRect(0, 0, el.width, el.height);
      if (next) {
        // "lighter" sums the alphas, giving a true (1-t)·A + t·B dissolve.
        // Plain source-over would leave A at full strength and only fade B in
        // on top, so the outgoing frame would never actually leave.
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 1 - blend;
        ctx.drawImage(img, 0, 0, el.width, el.height);
        ctx.globalAlpha = blend;
        ctx.drawImage(next, 0, 0, el.width, el.height);
        ctx.globalAlpha = 1;
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img, 0, 0, el.width, el.height);
      }
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, el.width, el.height);
      ctx.globalCompositeOperation = "source-over";
    };

    const schedule = () => {
      if (rafId.current === null) rafId.current = requestAnimationFrame(draw);
    };

    // Draw directly rather than via schedule(): requestAnimationFrame never
    // fires while the tab is hidden, so a page opened in a background tab
    // would otherwise sit blank until the visitor happened to scroll.
    draw();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", draw);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", draw);
      // Must null the id, not just cancel it: schedule() treats a non-null id
      // as "a frame is already pending" and would never schedule again after
      // this effect re-runs.
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [dir, count, ready, tint]);

  const pos = BG_POSITION[position];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-0 flex items-center overflow-hidden",
        pos.justify,
      )}
    >
      <canvas
        ref={canvas}
        style={{ aspectRatio: aspect, width: `min(${width}px, 100vw)` }}
        className={cn("opacity-50 dark:opacity-60", pos.translate)}
      />
    </div>
  );
}
