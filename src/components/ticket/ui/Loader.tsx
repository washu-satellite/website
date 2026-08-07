import { useEffect, useSyncExternalStore } from "react";
import type { Atlas } from "@/lib/ticket/atlas";
import {
  getAtlasServerState,
  getAtlasState,
  isPlayable,
  subscribeToAtlas,
} from "@/lib/ticket/atlasLoader";

/**
 * Holds the page until enough of the atlas is in to start. "Enough" is the first couple of pages
 * rather than all of them: pages map to consecutive stretches of the sequence, so the opening scroll
 * only needs the opening pages, and waiting for the last one meant staring at this screen through
 * thirteen megabytes. The rest keeps arriving behind the scene, and the scene clamps itself to the
 * frames that have landed.
 */
export function Loader({
  atlas,
  onReady,
}: {
  atlas: Atlas;
  onReady: () => void;
}) {
  const state = useSyncExternalStore(
    subscribeToAtlas,
    getAtlasState,
    getAtlasServerState,
  );

  const playable = isPlayable(state);

  useEffect(() => {
    if (playable) {
      console.log("Loader: playable", { pages: state.textures.length });
      onReady();
    }
  }, [playable, onReady, state.textures.length]);

  // Counts the plate alongside the pages it waits on, so the bar cannot sit at 100% with the piece
  // still held back.
  const needed = Math.min(2, atlas.pages.length) + 1;
  const have = Math.min(state.textures.length, needed - 1) + (state.plate ? 1 : 0);
  const pct = Math.round((have / needed) * 100);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#03020a]">
      <p className="text-[11px] uppercase tracking-[0.42em] text-amber-200/70">
        {state.failed ? "Signal lost" : "Preparing your ticket"}
      </p>
      <div className="mt-5 h-px w-[220px] bg-white/15">
        <div
          className="h-px bg-amber-200 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-4 text-[11px] tabular-nums tracking-[0.3em] text-white/35">
        {String(pct).padStart(3, "0")}
      </p>
    </div>
  );
}
