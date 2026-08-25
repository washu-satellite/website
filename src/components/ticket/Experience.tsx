import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useState } from "react";
import { HI_ATLAS, LO_ATLAS } from "@/lib/ticket/atlas";
import { startAtlasLoad } from "@/lib/ticket/atlasLoader";
import { usePointerTracking } from "@/lib/ticket/pointer";
import { useQuality } from "@/lib/ticket/quality";
import { SEQUENCE_VH } from "@/lib/ticket/layout";
import { SCROLL_SECTION_ID, ScrollProvider, useScrollSequence } from "@/lib/ticket/scroll";
import { Stage } from "./scene/Stage";
import { Ambience } from "./ui/Ambience";
import { DebugPanel } from "./ui/DebugPanel";
import { Headline } from "./ui/Headline";
import { Loader } from "./ui/Loader";

function Sequence() {
  const quality = useQuality();
  const { setScrollLocked } = useScrollSequence();
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  usePointerTracking();

  // Hold the page still while the frames land. Resizing the section instead would be worse than it
  // looks: ScrollTrigger caches its start/end when created, so a section that grows afterwards
  // leaves the whole sequence compressed into the first viewport of scroll.
  useEffect(() => {
    setScrollLocked(!ready);
  }, [ready, setScrollLocked]);

  const atlas = quality.tier === "low" ? LO_ATLAS : HI_ATLAS;

  // Kicked off here rather than from the loading screen, so the fetch does not depend on which
  // overlay happens to be mounted.
  useEffect(() => {
    startAtlasLoad(atlas);
  }, [atlas]);

  return (
    <>
      <section
        id={SCROLL_SECTION_ID}
        className="relative w-full"
        // Full height in every mode. Collapsing this to one viewport under reduced motion left the
        // page with nothing to scroll, which is why it read as completely stuck.
        style={{ height: `${SEQUENCE_VH}vh` }}
      >
        {/* Fixed, not sticky. A sticky child bottoms out exactly at the end of its section, and
            260vh of an 813px viewport is 2113.8px while scrollHeight rounds to 2114 -- so the last
            pixel of scroll pushes it 0.2px past the constraint. Chrome re-rasterises the perspective
            subtree at that moment and drops the form's translate(-50%,-50%), jumping it half its own
            height down the card. Fixed has no constraint boundary to cross. */}
        <div className="fixed inset-0 overflow-hidden">
          <Canvas
            dpr={quality.dpr}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 0, 5.5], fov: 42, near: 0.1, far: 200 }}
          >
            <Suspense fallback={null}>
              <Stage quality={quality} />
            </Suspense>
          </Canvas>
          <Headline />
          {/* Fetched only once the frames are in, so half a megabyte of audio never delays them. */}
          <Ambience enabled={ready} />
          {!ready && <Loader atlas={atlas} onReady={onReady} />}
        </div>
      </section>
      <DebugPanel />
    </>
  );
}

export default function Experience() {
  return (
    <ScrollProvider>
      <Sequence />
    </ScrollProvider>
  );
}
