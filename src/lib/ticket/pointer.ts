import { useEffect, useRef } from "react";

/** Normalized cursor position, -1..1 on both axes, origin at viewport centre. */
export const pointer = { x: 0, y: 0 };

let listeners = 0;

function onPointerMove(e: PointerEvent) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
}

function onPointerLeave() {
  pointer.x = 0;
  pointer.y = 0;
}

/**
 * One window listener shared by every pointer-reactive object. Each consumer damps toward
 * `pointer` at its own rate rather than reading it directly, which is what gives the objects
 * weight instead of a 1:1 cursor lock.
 */
export function usePointerTracking() {
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;
    listeners += 1;
    if (listeners === 1) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }
    return () => {
      registered.current = false;
      listeners -= 1;
      if (listeners === 0) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, []);
}
