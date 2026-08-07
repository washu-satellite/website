import { useEffect, useRef, useState } from "react";
import { BEATS, type BeatName } from "@/lib/ticket/beats";
import { useScrollSequence } from "@/lib/ticket/scroll";

const STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];

function beatAt(p: number): BeatName {
  const names = Object.keys(BEATS) as BeatName[];
  return (
    names.find((n) => p >= BEATS[n][0] && p < BEATS[n][1]) ?? "formIn"
  );
}

export function DebugPanel() {
  const { progress, debugP, debugEnabled } = useScrollSequence();
  const readout = useRef<HTMLSpanElement>(null);
  // Local mirror purely so the slider stays a controlled input; the scene reads the ref.
  const [override, setOverride] = useState<number | null>(null);

  // Plain function, not useCallback: this is a leaf component and memoizing a ref write here
  // trips the compiler's manual-memoization check for no benefit.
  const setDebugP = (p: number | null) => {
    debugP.current.value = p;
    setOverride(p);
  };

  useEffect(() => {
    if (!debugEnabled) return;
    let raf = 0;
    const tick = () => {
      const p = progress.current.current;
      if (readout.current) {
        readout.current.textContent = `${p.toFixed(3)}  ${beatAt(p)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [debugEnabled, progress]);

  if (!debugEnabled) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-72 rounded-lg border border-white/15 bg-black/80 p-3 font-mono text-[11px] text-white/80 backdrop-blur">
      <div className="flex items-center justify-between">
        <span ref={readout}>0.000</span>
        <button
          type="button"
          onClick={() => setDebugP(null)}
          className="rounded border border-white/20 px-2 py-0.5 hover:bg-white/10"
        >
          {override === null ? "scroll" : "release"}
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={override ?? 0}
        onChange={(e) => setDebugP(Number(e.target.value))}
        className="mt-3 w-full"
        aria-label="Sequence progress"
      />

      <div className="mt-2 flex gap-1">
        {STOPS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setDebugP(s)}
            className="flex-1 rounded border border-white/20 py-1 hover:bg-white/10"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
