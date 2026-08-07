/**
 * Deliberately overlapping. Sequential ranges make the sequence read as a list of separate steps;
 * every beat here starts before the previous one finishes, so the descent is still easing out while
 * the flap opens, the ticket starts leaving the envelope mid-unseal, and the envelope begins its
 * fall while the ticket is still climbing.
 */
export const BEATS = {
  idle: [0.0, 0.05],
  descent: [0.03, 0.6],
  unseal: [0.05, 0.34],
  emergence: [0.15, 0.7],
  fall: [0.52, 0.86],
  settle: [0.6, 0.95],
  formIn: [0.94, 1.0],
} as const;

export type BeatName = keyof typeof BEATS;

/**
 * The baked frames finish here rather than at 1, and the sequence holds on its last frame while it
 * dissolves into the cleaned plate. Holding first matters: cross-fading a still-moving frame into a
 * static image would read as a ghost rather than as the printed name simply lifting off the card.
 */
export const SEQUENCE_ENDS_AT = 0.84;
export const PLATE_FADE = [0.84, 0.93] as const;

export const FORM_VISIBLE_AT = BEATS.formIn[0];
export const FORM_INTERACTIVE_AT = 0.96;

/**
 * Where the sequence counts as landed, and the field takes focus on its own. Short of 1 because the
 * rendered progress is damped and only approaches its target asymptotically, and short enough that
 * a scroll that stops a hair early still arms the caret.
 */
export const FORM_SETTLED_AT = 0.995;

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Normalized 0..1 position of p inside [a,b], clamped outside. */
export function range(p: number, a: number, b: number): number {
  if (b === a) return p < a ? 0 : 1;
  return clamp01((p - a) / (b - a));
}

export function beat(p: number, name: BeatName): number {
  const [a, b] = BEATS[name];
  return range(p, a, b);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInCubic(t: number): number {
  return t * t * t;
}

export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Overshoots past 1 then settles back. Used so the ticket does not ease flatly into place. */
export function easeOutBack(t: number, overshoot = 1.35): number {
  const c3 = overshoot + 1;
  const u = t - 1;
  return 1 + c3 * u * u * u + overshoot * u * u;
}

export function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

/** Ramps 0->1 over [a,b] then back 1->0 over [b,c]. For values that peak mid-sequence. */
export function pulse(p: number, a: number, b: number, c: number): number {
  return p < b ? smoothstep(range(p, a, b)) : 1 - smoothstep(range(p, b, c));
}
