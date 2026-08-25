import { useFrame, useThree } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { beat, easeInOutCubic, lerp } from "@/lib/ticket/beats";
import { CAMERA_DESCENT, CAMERA_Z_END, CAMERA_Z_START } from "@/lib/ticket/layout";
import { pointer } from "@/lib/ticket/pointer";
import type { QualitySettings } from "@/lib/ticket/quality";
import { useScrollSequence } from "@/lib/ticket/scroll";
import { FrameSequence } from "./FrameSequence";
import { Space } from "./Space";
import { sequence } from "./sequence";

/**
 * How hard the rendered progress chases the scroll. A damped follower always trails a constant-rate
 * input by roughly 1/lambda seconds, and at 9 that was an eighth of a second of visible lag during the
 * auto-scroll cascade. High enough to track it, still low enough to swallow wheel jitter.
 */
const SCROLL_DAMP = 22;

/**
 * The envelope and ticket are pre-rendered sprite frames now, keyed over a live starfield. Nothing
 * left in the scene is lit, so there are no lights, no environment probe and no postprocessing: the
 * nebula is a baked texture and the star layers are unlit points. That is most of the old frame
 * cost gone.
 */
export function Stage({ quality }: { quality: QualitySettings }) {
  const { progress, debugP, publishPhases, reducedMotion } = useScrollSequence();
  const camera = useThree((s) => s.camera);

  useFrame((_, dt) => {
    const override = debugP.current.value;
    const target = override ?? progress.current.target;

    progress.current.current =
      reducedMotion || override !== null
        ? target
        : THREE.MathUtils.damp(progress.current.current, target, SCROLL_DAMP, dt);

    const p = progress.current.current;
    sequence.p = p;
    publishPhases(p);

    const descent = easeInOutCubic(beat(p, "descent"));
    camera.position.y = CAMERA_DESCENT * descent + pointer.y * 0.07;
    camera.position.x = pointer.x * 0.09;
    camera.position.z = lerp(CAMERA_Z_START, CAMERA_Z_END, descent);
    camera.lookAt(0, camera.position.y, 0);
  });

  return (
    <>
      <color attach="background" args={["#03020a"]} />
      <Space quality={quality} />
      {/* Its own boundary: useTexture suspends until every atlas page has loaded, and without this
          the whole scene including the starfield would wait on the download. */}
      <Suspense fallback={null}>
        <FrameSequence quality={quality} />
      </Suspense>
    </>
  );
}
