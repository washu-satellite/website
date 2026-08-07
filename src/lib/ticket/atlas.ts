/**
 * Frame lookup for the sprite-sheet atlases baked by scripts/bake-frames.sh. Kept out of the scene
 * component so the page/row/column arithmetic can be tested without a WebGL context.
 *
 * Every field here must match what the bake script produced. The layout is per-tier because the two
 * tiers have very different budgets: desktop spends GPU memory on resolution, phones cannot.
 */
export type Atlas = {
  pages: string[];
  frames: number;
  cols: number;
  rows: number;
};

/**
 * 1000x750 tiles against a 1280x960 source. Every frame stays resident as RGBA, so the real limit is
 * memory rather than download -- this is ~430MB of texture, and frame count and tile size trade
 * directly against each other. Resolution wins here: the sequence is drawn across the whole
 * viewport, so upscaling rather than frame rate is what reads as soft next to the source video.
 * Grids stay narrow enough that no page exceeds the 8192px max texture size older GPUs enforce.
 */
export const HI_ATLAS: Atlas = {
  pages: [
    "/ticket/frames/hi_1.webp",
    "/ticket/frames/hi_2.webp",
    "/ticket/frames/hi_3.webp",
    "/ticket/frames/hi_4.webp",
    "/ticket/frames/hi_5.webp",
    "/ticket/frames/hi_6.webp",
  ],
  frames: 144,
  cols: 6,
  rows: 4,
};

/**
 * The frame the sequence settles onto, with the printed "YOUR NAME HERE" removed so the input can
 * simply sit on the empty rule. This replaced a masking band that had to be colour-matched to the
 * card and rescaled every frame to stay over the placeholder it was hiding.
 */
export const PLATE_URL = "/ticket/frames/plate.webp";

/** 560x420 tiles over four small pages -- about 90MB, which a phone can actually hold. */
export const LO_ATLAS: Atlas = {
  pages: [
    "/ticket/frames/lo_1.webp",
    "/ticket/frames/lo_2.webp",
    "/ticket/frames/lo_3.webp",
    "/ticket/frames/lo_4.webp",
  ],
  frames: 96,
  cols: 6,
  rows: 4,
};

export function perPage(atlas: Atlas): number {
  return atlas.cols * atlas.rows;
}

export type FrameLookup = {
  /** Index into atlas.pages. */
  page: number;
  index: number;
  /** Bottom-left corner of the tile in texture UV space. */
  u: number;
  v: number;
};

/** Locates one frame by its absolute index. */
export function frameAtIndex(index: number, atlas: Atlas): FrameLookup {
  const clamped = Math.min(Math.max(Math.round(index), 0), atlas.frames - 1);
  const size = perPage(atlas);
  const page = Math.min(Math.floor(clamped / size), atlas.pages.length - 1);
  const tile = clamped - page * size;
  const col = tile % atlas.cols;
  const row = Math.floor(tile / atlas.cols);
  // Texture V runs bottom-up while the atlas is laid out top-down, so rows count from the top.
  return {
    page,
    index: clamped,
    u: col / atlas.cols,
    v: 1 - (row + 1) / atlas.rows,
  };
}

/** Maps scroll progress (0..1) to the atlas page and tile holding that frame. */
export function frameAt(progress: number, atlas: Atlas): FrameLookup {
  const p = Math.min(Math.max(progress, 0), 1);
  return frameAtIndex(p * (atlas.frames - 1), atlas);
}

export type FramePair = {
  a: FrameLookup;
  b: FrameLookup;
  /** Raw position between the two frames: 0 at `a`, 1 at `b`. */
  mix: number;
  /** What the shader should actually blend by. See shapeBlend. */
  blend: number;
};

/**
 * Fraction of the gap between two frames spent actually cross-fading. The rest of the gap sits on
 * one crisp frame or the other.
 */
export const BLEND_WINDOW = 0.3;

/**
 * A straight linear blend is on screen as a double exposure for the entire gap between frames, and
 * a half-and-half mix of two different poses reads as a ghost rather than as movement. Holding each
 * frame and crossing quickly between them keeps a real frame on screen most of the time, so the
 * ghost is a brief transition instead of the steady state.
 *
 * Smoothstep rather than a linear ramp inside the window, so there is no visible corner where the
 * blend starts and stops.
 */
export function shapeBlend(mix: number): number {
  const lo = 0.5 - BLEND_WINDOW / 2;
  const hi = 0.5 + BLEND_WINDOW / 2;
  const t = Math.min(Math.max((mix - lo) / (hi - lo), 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * The two frames bracketing this progress, plus how far between them we are. The scene cross-fades
 * the pair so motion reads as continuous instead of stepping from one baked frame to the next --
 * scroll resolves far finer than the rate the sequence was baked at.
 */
export function framePairAt(progress: number, atlas: Atlas): FramePair {
  const p = Math.min(Math.max(progress, 0), 1);
  const exact = p * (atlas.frames - 1);
  const lower = Math.floor(exact);
  const mix = exact - lower;
  return {
    a: frameAtIndex(lower, atlas),
    b: frameAtIndex(lower + 1, atlas),
    mix,
    blend: shapeBlend(mix),
  };
}
