import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { framePairAt, HI_ATLAS, LO_ATLAS } from "@/lib/ticket/atlas";
import {
  getAtlasServerState,
  getAtlasState,
  loadedProgressLimit,
  subscribeToAtlas,
} from "@/lib/ticket/atlasLoader";
import {
  clamp01,
  easeInOutCubic,
  PLATE_FADE,
  range,
  SEQUENCE_ENDS_AT,
  smoothstep,
} from "@/lib/ticket/beats";
import { pointer } from "@/lib/ticket/pointer";
import type { QualitySettings } from "@/lib/ticket/quality";
import { usePhases, useScrollSequence } from "@/lib/ticket/scroll";
import { TicketForm } from "../ui/TicketForm";
import { sequence } from "./sequence";

/**
 * Sprite-sheet atlases baked by scripts/bake-frames.sh. Scroll picks a frame; nothing decodes at
 * runtime. A <video> was the obvious choice and the wrong one: seeking is asynchronous, browsers
 * throttle media in backgrounded tabs, and a seek that lands mid-GOP shows the wrong frame. Atlases
 * make the sequence a pure function of scroll position, which is what the rest of the scene assumes.
 */

/** Distance in front of the camera the sprite plane is pinned at. */
const PLANE_DIST = 4;

/** Source frame aspect. */
const FRAME_ASPECT = 4 / 3;

/**
 * Gain on light the matte leaves uncovered -- the bloom. Because that light is added rather than
 * composited over, it can be pushed past 1 without ever hiding what is behind it.
 */
const GLOW_GAIN = 3.2;

/** Alpha below this is lossy-codec noise in an area the matte set to zero, not real coverage. */
const ALPHA_FLOOR = 0.09;

/**
 * Brightness over which a covered pixel is allowed to fully hide the starfield. Below it the
 * composite goes additive instead, so nothing dark can ever subtract from what is behind it.
 *
 * The ceiling is set by the subject, not the bloom: measured inside the matte, the fifth percentile
 * of the envelope's interior is 0.118, so anything higher starts making the card see-through. This
 * band only has to stop near-black from occluding -- the matte already decides what is subject.
 */
const OPAQUE_LO = 0.02;
const OPAQUE_HI = 0.09;

/**
 * The opening third composites as a screen off the frame's own brightness, with no matte involved,
 * so there is no cut-out edge to show a staircase while the envelope is small and glassy. Control
 * passes to the matte over this window, by which point the card has to occlude properly.
 */
const MATTE_TAKEOVER = [0.3, 0.45] as const;
/** Pushes the glass to full coverage in screen mode without blowing out the bloom. */
const SCREEN_GAIN = 1.5;

/**
 * Pointer response. The plane is pinned to the camera, so on its own it would sit dead still while
 * the starfield slides behind it. These push it the other way from the background and lean it into
 * the pointer, which is what sold the depth on the old all-WebGL version.
 */
const PARALLAX_X = 0.28;
const PARALLAX_Y = 0.2;
const TILT = 0.11;

/**
 * The pointer effect is gone by here. It reads as depth while the envelope floats, but the ticket
 * has to sit still to be read and typed on, so it unwinds well before the end.
 */
const EFFECT_ENDS_AT = 0.7;

/** Extra plane scale while tilted, so a lean never swings a frame edge into view. */
const TILT_MARGIN = 0.14;

/**
 * Ceiling on how far past a contain fit we will scale to fill the viewport. Loose, because the form
 * clamps its own width against the viewport now, so filling the frame no longer risks carrying the
 * button off the screen -- and anything short of full cover leaves a band of starfield above the
 * card on squarer displays. Only a very tall phone still gets letterboxed rather than magnified.
 */
const MAX_CROP = 2.2;

/**
 * Floor on how much of the frame's WIDTH stays on screen. MAX_CROP alone is not enough on a phone:
 * it is a multiple of the contain fit, and against a 4:3 frame on a portrait viewport that still
 * blew the card up to twice the screen width, so PASSENGER, SEAT and the writing line all sat off
 * the left edge and the card could not be read, let alone signed.
 *
 * Only ever binds on viewports narrower than the frame. Landscape is untouched -- at 1440x813 cover
 * already shows the full width, and a squarer 1280x1024 still crops to 94% and keeps its edges
 * touching. A portrait phone goes from 45% of the card visible to 92%.
 */
const MIN_WIDTH_VISIBLE = 0.92;

/**
 * Where the passenger rule sits on the plate, in normalised frame coordinates (0,0 top-left). A
 * single anchor now: the sequence is frozen well before the form appears, so there is nothing left
 * to track. `v` puts the field just above the rule rather than astride it, so the line still reads
 * as something you write on.
 */
const NAME = { u: 0.47, v: 0.512, w: 0.58 };

const FORM_PX = 430;
/** drei's Html transform mode maps DOM pixels to world units through this factor. */
const HTML_PX_PER_UNIT = 40;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Two tiles cross-faded, then composited. Scroll resolves far finer than the rate the sequence was
 * baked at, so snapping to the nearest frame reads as stepping; blending the bracketing pair makes
 * it continuous.
 *
 * Coverage is read from the atlas, not derived here. Deciding it per pixel cannot work: the flare's
 * skirt and the darkest pixel on the ticket sit at the same brightness and are both warm, so every
 * threshold either painted the flare's dark brown over the starfield or punched holes in the card.
 * Telling them apart needs neighbouring pixels, so scripts/matte.py does it once at bake time.
 */
const FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uMapA;
  uniform sampler2D uMapB;
  uniform vec2 uOffsetA;
  uniform vec2 uOffsetB;
  uniform sampler2D uPlate;
  uniform vec2 uScale;
  uniform float uMix;
  uniform float uPlateMix;
  uniform float uGlow;
  uniform float uFloor;
  uniform float uOpaqueLo;
  uniform float uOpaqueHi;
  uniform float uScreenGain;
  uniform float uMatteMix;
  void main() {
    vec2 t = vUv * uScale;
    vec4 s = mix(
      texture2D(uMapA, uOffsetA + t),
      texture2D(uMapB, uOffsetB + t),
      uMix
    );
    // The settle plate is a whole frame, not a tile, so it samples straight off vUv.
    s = mix(s, texture2D(uPlate, vUv), uPlateMix);
    vec3 c = s.rgb;
    float a = s.a;
    // The matte is a hard zero across the background, so anything small here is the lossy alpha
    // plane's quantisation, not coverage. Left alone it comes back as faint horizontal bands of
    // near-black laid over the stars. Same argument for the colour: clip the codec's floor noise
    // before the glow gain multiplies it into something visible.
    a = clamp((a - uFloor) / (1.0 - uFloor), 0.0, 1.0);

    // Coverage and opacity are different questions, and conflating them is what drew the bloom as
    // a dark blob: the matte covers it, so it was hiding the starfield behind near-black while
    // adding almost nothing back.
    //
    // Coverage comes from the matte. How much a pixel may HIDE also depends on whether it has the
    // light to replace what it hides -- a dark pixel never earns that, however well covered. So the
    // composite slides from purely additive in the bloom to ordinary alpha over the body, and
    // nothing can ever darken what is behind it. The card's darkest pixel is 0.20, above this band,
    // so it still occludes fully.
    float brightness = max(max(c.r, c.g), c.b);
    float matteK = a * smoothstep(uOpaqueLo, uOpaqueHi, brightness);

    // Screen, for the opening third. While the subject is glowing glass on black there is nothing
    // to cut out, so coverage comes from the image's own brightness rather than the matte's outline,
    // and the envelope keeps its soft glassy edge. Premultiplied blending with coverage set to
    // brightness is a screen: result = c + dst * (1 - brightness).
    //
    // It still has to fade out on the matte, though. libwebp zeroes colour wherever alpha is exactly
    // zero, so the atlas carries a hard boundary between kept and cleaned pixels. Alpha hides that
    // in matte mode; screen mode reads colour directly and drew the boundary as a blocky grey
    // rectangle around the subject. Fading on the same edge the encoder cut against removes it.
    float gateSoft = smoothstep(0.0, 0.12, a);
    float screenK = clamp(brightness * uScreenGain, 0.0, 1.0) * gateSoft;

    // Hands over to the matte once the card has to actually hide what is behind it.
    float k = mix(screenK, matteK, uMatteMix);

    // Still gated on coverage: the matte is a hard zero across the background, so the only thing out
    // there is the codec smearing chroma sideways, and the gain would draw it as pink streaks. In
    // screen mode the colour passes through unscaled, which is what makes it a screen rather than a
    // gained add.
    //
    // Gated on darkness too, and that is what keeps hard edges clean. The additive term is scaled by
    // (1 - k), which peaks in the middle of the matte's own transition band -- so every silhouette
    // edge was being lit by up to 2.8x and the card's bottom rim came out as bright broken piping.
    // The bloom is by definition the dark light the opacity test declined to make solid, so tying the
    // gain to that same darkness leaves the halo alone and drops the fringe to nothing.
    float dark = 1.0 - smoothstep(uOpaqueLo, uOpaqueHi, brightness);
    float glow = mix(gateSoft, uGlow * smoothstep(0.0, 0.2, a) * dark, uMatteMix);

    // The material is premultipliedAlpha, so passing un-premultiplied colour composites additively
    // exactly where the matte leaves off: result is c * gain + dst * (1 - a). The bloom is emitted
    // light, so it brightens the starfield rather than covering it -- a glow that hides stars reads
    // as a smudge.
    if (k <= 0.002 && brightness <= 0.006) discard;
    gl_FragColor = vec4(c * (k + (1.0 - k) * glow), k);
  }
`;

export function FrameSequence({ quality }: { quality: QualitySettings }) {
  const rig = useRef<THREE.Group>(null);
  const screen = useRef<THREE.Mesh>(null);
  const formAnchor = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const { reducedMotion, setScrollLocked } = useScrollSequence();
  const phases = usePhases();
  const [passenger, setPassenger] = useState<string | null>(null);

  const atlas = quality.tier === "low" ? LO_ATLAS : HI_ATLAS;
  // Pages arrive one at a time and the scene renders on whatever is in. Texture settings live with
  // the loader now, since it is what constructs them. NoColorSpace is the load-bearing one: sRGB
  // makes the GPU linearise on sample, dragging a dark violet from 0.15 to 0.02 -- into the key's
  // cutoff, so the glass vanished with the background.
  const atlasState = useSyncExternalStore(
    subscribeToAtlas,
    getAtlasState,
    getAtlasServerState,
  );
  const pages = atlasState.textures;
  const plate = atlasState.plate;

  // How far the frames that have actually arrived can carry the sequence.
  const progressLimit = loadedProgressLimit(atlasState, atlas);

  // Hands each page to the GPU the moment it decodes, rather than leaving the driver to do it the
  // first frame that samples it. Uploading 6480x3240 RGBA blocks for about 250ms, and lazily that
  // lands mid-scroll as a stall; done here it happens while the loading screen is still up.
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    for (const page of pages) gl.initTexture(page);
    if (plate) gl.initTexture(plate);
  }, [gl, pages, plate]);

  const uniforms = useMemo(
    () => ({
      uMapA: { value: pages[0] ?? null },
      uMapB: { value: pages[0] ?? null },
      uOffsetA: { value: new THREE.Vector2(0, 1 - 1 / atlas.rows) },
      uOffsetB: { value: new THREE.Vector2(0, 1 - 1 / atlas.rows) },
      uScale: { value: new THREE.Vector2(1 / atlas.cols, 1 / atlas.rows) },
      uPlate: { value: plate ?? null },
      uMix: { value: 0 },
      uPlateMix: { value: 0 },
      uGlow: { value: GLOW_GAIN },
      uFloor: { value: ALPHA_FLOOR },
      uOpaqueLo: { value: OPAQUE_LO },
      uOpaqueHi: { value: OPAQUE_HI },
      uScreenGain: { value: SCREEN_GAIN },
      uMatteMix: { value: 0 },
    }),
    [pages, plate, atlas],
  );

  useFrame(() => {
    const g = rig.current;
    const mesh = screen.current;
    if (!g || !mesh || pages.length === 0) return;

    const p = reducedMotion ? 1 : sequence.p;
    const effect = reducedMotion
      ? 0
      : 1 - easeInOutCubic(clamp01(p / EFFECT_ENDS_AT));

    // Pinned to the camera, then pushed back against it. The camera drifts toward the pointer, so
    // adding the same sign here moves the sequence the opposite way from the world behind it.
    g.position.copy(camera.position);
    g.quaternion.copy(camera.quaternion);
    g.translateZ(-PLANE_DIST);
    g.translateX(pointer.x * PARALLAX_X * effect);
    g.translateY(pointer.y * PARALLAX_Y * effect);
    g.rotateY(pointer.x * TILT * effect);
    g.rotateX(-pointer.y * TILT * effect);

    // COVER the frustum. The source render crops its own subject at the frame border partway
    // through, so any letterboxing puts that baked-in cut in open view mid-screen; filling the
    // viewport pushes the frame's edges off it. The margin term keeps a lean from swinging an edge
    // back into view, and unwinds with the tilt.
    const frustumH =
      2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * PLANE_DIST;
    const frustumW = frustumH * (size.width / size.height);
    const cover = Math.max(frustumW, frustumH * FRAME_ASPECT);
    const contain = Math.min(frustumW, frustumH * FRAME_ASPECT);
    const planeW =
      Math.min(cover, contain * MAX_CROP, frustumW / MIN_WIDTH_VISIBLE) *
      (1 + TILT_MARGIN * effect);
    const planeH = planeW / FRAME_ASPECT;
    mesh.scale.set(planeW, planeH, 1);

    if (formAnchor.current) {
      // Tracks the printed line, but never wider than the viewport can show. On a narrow screen the
      // line is scaled up with the rest of the frame and would otherwise carry the button off the
      // edge, which is worse than a form that is slightly narrower than the rule it sits on.
      // The ceiling is a fraction of the viewport, not of the frame. On a landscape display the
      // frame and the viewport are the same width so NAME.w governs; on a narrow one the frame is
      // scaled well past the viewport and this is what stops the form going with it.
      const formWidth = Math.min(NAME.w * planeW, frustumW * 0.66);
      // The gutter matters: without it the clamp is free to slide the form until its edge sits
      // exactly on the viewport boundary, which reads as clipped rather than placed.
      const halfSlack = Math.max(
        (frustumW - formWidth) / 2 - frustumW * 0.03,
        0,
      );
      const anchorX = (NAME.u - 0.5) * planeW;

      formAnchor.current.position.set(
        THREE.MathUtils.clamp(anchorX, -halfSlack, halfSlack),
        (0.5 - NAME.v) * planeH,
        0.01,
      );
      // Scale on the anchor rather than through React state. Routing this through setState re-ran
      // the whole tree on every frame of the push-in, which is exactly when it can least afford it.
      formAnchor.current.scale.setScalar(
        (HTML_PX_PER_UNIT * formWidth) / FORM_PX,
      );
    }

    // The baked frames run out at SEQUENCE_ENDS_AT and hold there; the remaining scroll dissolves
    // that held frame into the cleaned plate, so the printed name lifts off a card that is otherwise
    // already still.
    // Clamped to the pages that have decoded: on a slow connection the sequence holds on the last
    // frame it has rather than sampling a page that has not arrived.
    const pair = framePairAt(
      Math.min(p / SEQUENCE_ENDS_AT, progressLimit),
      atlas,
    );
    // Written through the material's own uniforms rather than the object handed to the JSX prop.
    // Mutating a uniform's value in place reaches the shader either way, but REASSIGNING one only
    // lands if this is the very object the renderer reads -- swapping atlas pages silently did
    // nothing until this went through mesh.material.
    const mat = mesh.material as THREE.ShaderMaterial;
    mat.uniforms.uMapA.value = pages[pair.a.page] ?? pages[pages.length - 1];
    mat.uniforms.uMapB.value = pages[pair.b.page] ?? pages[pages.length - 1];
    mat.uniforms.uPlate.value = plate ?? pages[0];
    mat.uniforms.uOffsetA.value.set(pair.a.u, pair.a.v);
    mat.uniforms.uOffsetB.value.set(pair.b.u, pair.b.v);
    mat.uniforms.uMix.value = pair.blend;
    mat.uniforms.uMatteMix.value = smoothstep(
      range(p, MATTE_TAKEOVER[0], MATTE_TAKEOVER[1]),
    );
    mat.uniforms.uPlateMix.value = smoothstep(
      range(p, PLATE_FADE[0], PLATE_FADE[1]),
    );
  });

  // Nothing to draw until the opening page is decoded; the loading screen is still up at that point.
  if (pages.length === 0) return null;

  return (
    <group ref={rig}>
      <mesh ref={screen} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
          premultipliedAlpha
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <group ref={formAnchor}>
        {/* Mounted from the start rather than when it becomes visible. drei's Html measures its box
            when it appears and positions from that, so appearing late meant the field settled and
            then shifted a few pixels once measured. Nothing moves if nothing mounts late; the phase
            only drives opacity. */}
        <Html
          transform
          center
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              opacity: phases.formVisible ? 1 : 0,
              transition: "opacity 260ms ease-out",
              pointerEvents: phases.formInteractive ? "auto" : "none",
            }}
          >
            <TicketForm
              interactive={phases.formInteractive}
              settled={phases.formSettled}
              onSaved={setPassenger}
              setScrollLocked={setScrollLocked}
              confirmedName={passenger}
            />
          </div>
        </Html>
      </group>
    </group>
  );
}
