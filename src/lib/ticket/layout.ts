import * as THREE from "three";

/**
 * Shared vertical staging. The envelope descends further than the camera, so it drifts down-frame
 * during the descent and leaves headroom above it for the ticket to emerge into.
 */
/**
 * Total scroll distance for the whole sequence. Lower means the beats arrive faster. Halved from 520 to run the
 * animation at twice the speed. The shader cross-fades between baked frames, so a shorter run does
 * not reintroduce stepping the way it would if the sequence snapped frame to frame.
 */
export const SEQUENCE_VH = 260;

export const CAMERA_DESCENT = -1.4;
export const ENVELOPE_DESCENT = -1.85;
export const CAMERA_Z_START = 5.5;
export const CAMERA_Z_END = 5.15;

/** Idle offset so the envelope clears the headline before the descent begins. */
export const ENVELOPE_IDLE_Y = -0.22;

/** Narrow viewports would otherwise crop the envelope; shrink the props rather than move the camera. */
export function fitScale(aspect: number): number {
  return THREE.MathUtils.clamp(aspect / 1.5, 0.62, 1);
}

/**
 * Distance at which an object of this size sits comfortably inside the frustum with margin.
 * Computed every frame so the settled ticket fits any viewport, phone or ultrawide.
 */
export function distanceToFit(
  fovDegrees: number,
  aspect: number,
  width: number,
  height: number,
  heightMargin = 1.9,
  widthMargin = 1.22,
): number {
  const halfH = Math.tan(THREE.MathUtils.degToRad(fovDegrees) / 2);
  const forHeight = (height * heightMargin) / 2 / halfH;
  const forWidth = (width * widthMargin) / 2 / (halfH * aspect);
  return Math.max(forHeight, forWidth);
}
