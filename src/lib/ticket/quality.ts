import { useSyncExternalStore } from "react";
import { HI_ATLAS } from "./atlas";

export type QualityTier = "high" | "low";

export type QualitySettings = {
  tier: QualityTier;
  /** Width of the baked nebula texture; height is half. Cost is paid once, not per frame. */
  nebulaResolution: number;
  midStars: number;
  nearMotes: number;
  dpr: [number, number];
};

/**
 * Widest atlas page the high tier ships (tile width x cols). A GPU that cannot allocate this must
 * not be given the high tier: the upload fails silently and the sequence never appears.
 */
const HI_TILE_WIDTH = 1080;
const HI_PAGE_WIDTH = HI_TILE_WIDTH * HI_ATLAS.cols;

const HIGH: QualitySettings = {
  tier: "high",
  nebulaResolution: 2048,
  midStars: 4200,
  nearMotes: 260,
  dpr: [1, 2],
};

/**
 * Phones are fill-rate bound, so the wins here are pixels: a lower DPR cap, a smaller nebula bake,
 * fewer star points, and the smaller atlas. Every beat still runs.
 */
const LOW: QualitySettings = {
  tier: "low",
  nebulaResolution: 1024,
  midStars: 1400,
  nearMotes: 70,
  dpr: [1, 1.5],
};

type GpuProbe = { maxTexture: number; software: boolean };

/**
 * One throwaway context, read once. The alternative is discovering the limit when a 7680px page
 * fails to upload, which surfaces as a blank sequence rather than an error.
 */
function probeGpu(): GpuProbe {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return { maxTexture: 0, software: true };

    const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : "";
    // SwiftShader/llvmpipe render on the CPU; a full-viewport quad plus a starfield will crawl.
    const software = /swiftshader|llvmpipe|software|basic render/i.test(
      renderer,
    );

    const lose = gl.getExtension("WEBGL_lose_context");
    lose?.loseContext();

    console.log("quality: gpu probe", { maxTexture, renderer, software });
    return { maxTexture, software };
  } catch (err) {
    console.error("quality: gpu probe failed, assuming low tier", { err });
    return { maxTexture: 0, software: true };
  }
}

/** `?tier=high|low` overrides detection, for testing the other tier on this machine. */
function forcedTier(): QualityTier | null {
  const raw = new URLSearchParams(window.location.search).get("tier");
  return raw === "high" || raw === "low" ? raw : null;
}

function detectTier(): QualityTier {
  const forced = forcedTier();
  if (forced) {
    console.log("quality: tier forced by query param", { forced });
    return forced;
  }

  const gpu = probeGpu();

  // Hard gates: the high tier is simply unusable on these, regardless of anything else.
  if (gpu.software) return "low";
  if (gpu.maxTexture < HI_PAGE_WIDTH) {
    console.log("quality: max texture size below the high-tier atlas page", {
      maxTexture: gpu.maxTexture,
      needed: HI_PAGE_WIDTH,
    });
    return "low";
  }

  const narrow = window.matchMedia("(max-width: 900px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  // Phones report a coarse pointer; so do touchscreen laptops, hence the width pairing.
  if (coarse && narrow) return "low";

  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores <= 4) return "low";

  // deviceMemory is Chromium-only and rounded, but a 2GB machine holding a 400MB atlas will swap.
  const memory = (navigator as { deviceMemory?: number }).deviceMemory;
  if (typeof memory === "number" && memory <= 4) return "low";

  // The high tier is a 6MB download; honour an explicit request not to spend it.
  const connection = (
    navigator as {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (connection?.saveData) return "low";
  if (
    connection?.effectiveType &&
    /^(slow-)?2g$|^3g$/.test(connection.effectiveType)
  ) {
    return "low";
  }

  if (window.matchMedia("(prefers-reduced-data: reduce)").matches) return "low";

  return "high";
}

/**
 * Resolved once per session, not on resize: swapping atlases mid-session reallocates every texture
 * and stutters far worse than a slightly wrong tier. Cached at module scope so getSnapshot keeps
 * returning the same reference.
 */
let cachedQuality: QualitySettings | null = null;

function getQuality(): QualitySettings {
  if (!cachedQuality) {
    const tier = detectTier();
    console.log("quality: resolved tier", {
      tier,
      atlasPages: tier === "high" ? HI_ATLAS.pages.length : undefined,
    });
    cachedQuality = tier === "low" ? LOW : HIGH;
  }
  return cachedQuality;
}

const neverChanges = () => () => {};

export function useQuality(): QualitySettings {
  return useSyncExternalStore(neverChanges, getQuality, () => HIGH);
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}
