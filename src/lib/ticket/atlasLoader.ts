import * as THREE from "three";
import { PLATE_URL, perPage, type Atlas } from "./atlas";

/**
 * Loads the atlas a page at a time, in order, and publishes progress as it goes.
 *
 * A module store rather than a hook, because two very different consumers need the same load: the
 * DOM loading screen, which sits outside the canvas, and the scene inside it. Running it twice would
 * fetch thirteen megabytes twice.
 *
 * Order is the whole point. Pages map to consecutive stretches of the sequence, so page one is what
 * the opening scroll needs and page six is not wanted until the very end. Fetching sequentially
 * costs nothing on a bandwidth-bound connection and means the scene can start on the first page
 * instead of the last.
 */

/**
 * Pages that must be in before the piece starts.
 *
 * This wants to be 2 -- that covers the first third of the sequence and only a fifth of the payload.
 * It cannot be, and the reason is upload rather than download. A page is 6480x3240 RGBA, so handing
 * one to the GPU costs about 250ms of blocked main thread, and the driver does that lazily the first
 * frame the page is actually sampled. Starting early therefore does not avoid the work, it just
 * moves six 250ms stalls out of the loading screen and into the scroll, which is far worse than
 * waiting: measured, a full-load start ran the whole sequence with no frame over 45ms, while a
 * two-page start stuttered every few hundred milliseconds all the way down.
 *
 * So every page is decoded AND uploaded before the piece starts. Compressed textures (KTX2/BC7) are
 * what would actually make an early start viable, by cutting the upload to about a quarter.
 */
export const MIN_PAGES = Number.POSITIVE_INFINITY;

export type AtlasLoadState = {
  /** Decoded pages, in order. Never sparse: index n is only present once every page before it is. */
  textures: THREE.Texture[];
  plate: THREE.Texture | null;
  totalPages: number;
  /** First URL that failed, if any. The scene still runs on whatever did arrive. */
  failed: string | null;
};

let state: AtlasLoadState = {
  textures: [],
  plate: null,
  totalPages: 0,
  failed: null,
};

const listeners = new Set<() => void>();
let startedFor: Atlas | null = null;

function publish(next: Partial<AtlasLoadState>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

export function subscribeToAtlas(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAtlasState(): AtlasLoadState {
  return state;
}

export function getAtlasServerState(): AtlasLoadState {
  return state;
}

/** True once enough pages are in to start, so the loading screen can step aside. */
export function isPlayable(s: AtlasLoadState): boolean {
  return (
    s.totalPages > 0 &&
    s.textures.length >= Math.min(MIN_PAGES, s.totalPages) &&
    s.plate !== null
  );
}

/**
 * How far into the sequence the frames that have actually arrived can carry us. The scene clamps to
 * this so a fast scroll on a slow connection holds on the last decoded frame rather than sampling a
 * page that is not there yet.
 */
export function loadedProgressLimit(s: AtlasLoadState, atlas: Atlas): number {
  if (s.textures.length >= atlas.pages.length) return 1;
  const usable = Math.min(atlas.frames, s.textures.length * perPage(atlas));
  if (usable <= 1) return 0;
  return (usable - 1) / (atlas.frames - 1);
}

function configure(texture: THREE.Texture): THREE.Texture {
  // NoColorSpace, deliberately -- see the note in FrameSequence: the key runs on stored sRGB values.
  texture.colorSpace = THREE.NoColorSpace;
  // Mipmaps would blend neighbouring tiles into each other at distance.
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

async function loadTexture(url: string): Promise<THREE.Texture> {
  const image = new Image();
  image.src = url;
  try {
    // decode() rather than onload: it resolves after the pixels are ready, so the first upload of a
    // 6480x3240 page cannot land as a hitch in the middle of the opening scroll.
    await image.decode();
  } catch (err) {
    throw new Error(`Could not decode atlas page ${url}`, { cause: err });
  }
  return configure(new THREE.Texture(image));
}

export function startAtlasLoad(atlas: Atlas): void {
  if (startedFor === atlas) return;
  startedFor = atlas;
  publish({ textures: [], plate: null, totalPages: atlas.pages.length, failed: null });

  // Every request goes out at once, then results are consumed in order. Fetching one at a time left
  // the network idle through each 250ms upload; this keeps it saturated while the GPU works, and
  // order is preserved by awaiting in sequence rather than by delaying the requests.
  const pending = atlas.pages.map((url) => loadTexture(url));
  const platePending = loadTexture(PLATE_URL);

  void (async () => {
    console.log("atlas: loading", { pages: atlas.pages.length });

    try {
      publish({ plate: await platePending });
    } catch (err) {
      console.error("atlas: plate failed", { url: PLATE_URL, err });
      publish({ failed: state.failed ?? PLATE_URL });
    }

    for (const [index, promise] of pending.entries()) {
      try {
        const texture = await promise;
        publish({ textures: [...state.textures, texture] });
        console.log("atlas: page ready", { index: index + 1 });
      } catch (err) {
        console.error("atlas: page failed", { url: atlas.pages[index], err });
        publish({ failed: state.failed ?? atlas.pages[index] });
        // Stop rather than skip: the scene only advances through pages it holds in order, so a gap
        // would strand everything after it anyway.
        break;
      }
    }

    console.log("atlas: load finished", {
      pages: state.textures.length,
      plate: state.plate !== null,
    });
  })();
}
