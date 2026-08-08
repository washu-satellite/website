import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  FORM_INTERACTIVE_AT,
  FORM_SETTLED_AT,
  FORM_VISIBLE_AT,
  clamp01,
} from "./beats";
import { usePrefersReducedMotion } from "./quality";

/**
 * Continuous scroll progress lives in a ref, never in state: the scene reads it every frame and a
 * per-frame React render would cost more than the whole 3D scene. Only the discrete phase flags
 * below cross into React, and each setter is equality-guarded so repeated threshold crossings do
 * not re-render.
 */
export type ScrollProgress = {
  /** Raw 0..1 written by ScrollTrigger. The scene damps toward this. */
  target: number;
  /** Damped value the scene actually renders. Owned by the Stage's useFrame. */
  current: number;
};

type Phases = {
  formVisible: boolean;
  formInteractive: boolean;
  /** The sequence has landed; the field may take focus without being asked. */
  formSettled: boolean;
};

/**
 * Everything here is a ref or a stable callback, so the context value never changes identity after
 * mount. That matters: Stage consumes it, and a Stage re-render reconciles the EffectComposer and
 * Environment subtrees, which rebuilds their render targets and shows a black frame. Phases live in
 * their own context so the components that need them re-render without dragging the scene along.
 */
type ScrollContextValue = {
  progress: React.RefObject<ScrollProgress>;
  /** Debug override: when non-null the scene ignores scroll and renders this p. */
  debugP: React.RefObject<{ value: number | null }>;
  reducedMotion: boolean;
  debugEnabled: boolean;
  /** Suspends smooth scrolling so typing in the form never scrolls the page. */
  setScrollLocked: (locked: boolean) => void;
  /** Called by the Stage each frame after it damps `current`, to publish phase changes. */
  publishPhases: (p: number) => void;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);
const PhasesContext = createContext<Phases>({
  formVisible: false,
  formInteractive: false,
  formSettled: false,
});

export const SCROLL_SECTION_ID = "sequence";

/** Speed of the cascade during its constant stretch, in CSS pixels per second. */
const CASCADE_RATE = 700;

/** Fraction of the run held at that speed before it starts easing out. */
const CASCADE_CONSTANT = 0.82;

/** A nudge this small is noise -- a trackpad settling, or a rounding wobble. */
const GESTURE_EPSILON = 1.5;

/**
 * Constant speed for most of the run, then a linear glide to a stop. Position, not velocity: the
 * velocity is flat at `v` until CASCADE_CONSTANT and ramps to zero after, and `v` is whatever makes
 * the whole thing land exactly at 1.
 *
 * A plain ease-out would be slowing down the entire way, which is the opposite of "cascades at a
 * constant rate".
 */
export function cascadeEase(t: number): number {
  const k = CASCADE_CONSTANT;
  const v = 2 / (1 + k);
  if (t <= k) return v * t;
  const d = t - k;
  return v * k + v * d - (v * d * d) / (2 * (1 - k));
}

// Read once and cached so getSnapshot returns a stable value for the lifetime of the page.
let cachedDebugEnabled: boolean | null = null;
const NEVER_CHANGES = () => () => {};

function getDebugEnabled(): boolean {
  if (cachedDebugEnabled === null) {
    cachedDebugEnabled = new URLSearchParams(window.location.search).has("debug");
  }
  return cachedDebugEnabled;
}

let cachedPinnedP: number | null | undefined;

/** `?p=0.62` pins the sequence at a fixed progress, for inspecting one beat without scrolling to it. */
function getPinnedP(): number | null {
  if (cachedPinnedP === undefined) {
    const raw = new URLSearchParams(window.location.search).get("p");
    const value = raw === null ? Number.NaN : Number(raw);
    cachedPinnedP = Number.isFinite(value)
      ? Math.min(Math.max(value, 0), 1)
      : null;
  }
  return cachedPinnedP;
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const progress = useRef<ScrollProgress>({ target: 0, current: 0 });
  const lenisRef = useRef<Lenis | null>(null);
  const [scrolledPhases, setScrolledPhases] = useState<Phases>({
    formVisible: false,
    formInteractive: false,
    formSettled: false,
  });
  const pinnedP = useSyncExternalStore(NEVER_CHANGES, getPinnedP, () => null);
  const debugP = useRef<{ value: number | null }>({ value: pinnedP });
  const debugEnabled = useSyncExternalStore(NEVER_CHANGES, getDebugEnabled, () => false);
  const reducedMotion = usePrefersReducedMotion();

  // Reduced motion skips the sequence entirely and renders the final composed state, so the
  // phases are derived rather than stored -- nothing has to drive them to `true`.
  const phases = useMemo<Phases>(
    () =>
      reducedMotion
        ? { formVisible: true, formInteractive: true, formSettled: true }
        : scrolledPhases,
    [reducedMotion, scrolledPhases],
  );

  useEffect(() => {
    if (!reducedMotion) return;
    progress.current.target = 1;
    progress.current.current = 1;
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1 });
    lenisRef.current = lenis;

    // Driving Lenis from the GSAP ticker puts scroll updates and ScrollTrigger evaluation in the
    // same execution block. Running Lenis on its own RAF loop causes visible jitter.
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const section = document.getElementById(SCROLL_SECTION_ID);
    if (!section) {
      console.error("ScrollProvider: sequence section not found", {
        id: SCROLL_SECTION_ID,
      });
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress.current.target = clamp01(self.progress);
      },
    });

    // One downward gesture hands the sequence off to a cascade that carries it to the end on its
    // own. Any upward gesture drops it immediately and gives the scroll straight back.
    //
    // Driven here rather than through lenis.scrollTo: Lenis abandons a scrollTo the moment it sees
    // user input, so a run of wheel events would keep killing and restarting the tween. Setting the
    // position ourselves each tick means continued downward input is simply absorbed, which is what
    // "keeps cascading at a constant rate" has to mean.
    // A touch screen never gets the cascade. It exists to carry a wheel gesture onward, which is
    // something a flick already does by itself, and Lenis is not intercepting touch here -- so the
    // browser runs its own momentum scroll while the cascade writes scrollTop every frame. Two
    // schedulers fighting over one value reads, on iOS, as the page fighting your finger.
    const touchDriven = window.matchMedia("(pointer: coarse)").matches;

    const cascade = { active: false, from: 0, to: 0, elapsed: 0, duration: 0 };

    const stopCascade = () => {
      cascade.active = false;
    };

    const startCascade = () => {
      if (touchDriven || cascade.active || lenisRef.current === null) return;
      const to = Math.min(
        section.offsetTop + section.offsetHeight - window.innerHeight,
        lenis.limit,
      );
      const from = lenis.animatedScroll;
      const distance = to - from;
      if (distance <= 8) return;

      cascade.active = true;
      cascade.from = from;
      cascade.to = to;
      cascade.elapsed = 0;
      // Solve for the duration that makes the flat stretch run at CASCADE_RATE.
      cascade.duration = ((2 / (1 + CASCADE_CONSTANT)) * distance) / CASCADE_RATE;
      console.log("scroll: cascade started", {
        distance: Math.round(distance),
        seconds: Number(cascade.duration.toFixed(2)),
      });
    };

    const advanceCascade = (deltaSeconds: number) => {
      if (!cascade.active) return;
      // A locked Lenis means the form has focus; driving the page under the caret is hostile.
      if (lenis.isStopped) {
        stopCascade();
        return;
      }
      cascade.elapsed += deltaSeconds;
      const t = Math.min(cascade.elapsed / cascade.duration, 1);
      const y = cascade.from + (cascade.to - cascade.from) * cascadeEase(t);
      lenis.scrollTo(y, { immediate: true, force: true });
      if (t >= 1) stopCascade();
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > GESTURE_EPSILON) startCascade();
      else if (e.deltaY < -GESTURE_EPSILON) stopCascade();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Typing must never drive the page. The field takes focus by itself at the end now, so a
      // space in a passenger's name would otherwise launch the cascade from under the caret.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      ) {
        return;
      }
      if (["ArrowDown", "PageDown", "Space"].includes(e.code)) startCascade();
      else if (["ArrowUp", "PageUp", "Home"].includes(e.code)) stopCascade();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    let lastTime = 0;
    const drive = (time: number) => {
      const seconds = time;
      const delta = lastTime === 0 ? 0 : seconds - lastTime;
      lastTime = seconds;
      // Clamped so a backgrounded tab returning does not teleport the page.
      advanceCascade(Math.min(delta, 0.05));
    };
    gsap.ticker.add(drive);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      gsap.ticker.remove(drive);
      trigger.kill();
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const setScrollLocked = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, []);

  const publishPhases = useCallback((p: number) => {
    const next = {
      formVisible: p >= FORM_VISIBLE_AT,
      formInteractive: p >= FORM_INTERACTIVE_AT,
      formSettled: p >= FORM_SETTLED_AT,
    };
    setScrolledPhases((prev) =>
      prev.formVisible === next.formVisible &&
      prev.formInteractive === next.formInteractive &&
      prev.formSettled === next.formSettled
        ? prev
        : next,
    );
  }, []);

  const value = useMemo<ScrollContextValue>(
    () => ({
      progress,
      debugP,
      reducedMotion,
      debugEnabled,
      setScrollLocked,
      publishPhases,
    }),
    [reducedMotion, debugEnabled, setScrollLocked, publishPhases],
  );

  return (
    <ScrollContext.Provider value={value}>
      <PhasesContext.Provider value={phases}>{children}</PhasesContext.Provider>
    </ScrollContext.Provider>
  );
}

export function useScrollSequence(): ScrollContextValue {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScrollSequence must be used inside <ScrollProvider>");
  }
  return ctx;
}

export function usePhases(): Phases {
  return useContext(PhasesContext);
}
