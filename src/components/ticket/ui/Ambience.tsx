import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Looping background pad.
 *
 * Played through Web Audio rather than an <audio loop> element, because AAC carries encoder delay
 * and padding: an element loop restarts at the start of that padding and drops an audible gap every
 * pass. An AudioBufferSourceNode loops on decoded sample frames, so the seam is exactly the one the
 * crossfade was built for.
 *
 * Source: "Lo-Fi Space Ambient Drone Music" by Forgotten Dawn, CC BY 3.0, via Wikimedia Commons.
 * https://commons.wikimedia.org/wiki/File:Lo-Fi_Space_Ambient_Drone_Music_-_1_Hour.webm
 * A 60s window was cut and crossfaded into a seamless loop. Attribution is required by the licence,
 * so it is also carried in the button's title and must stay on the page in some form.
 */
const TRACK_URL = "/ticket/audio/ambience.m4a";

/** Quiet enough to sit under the piece rather than score it. */
const VOLUME = 0.32;

/** Long enough that the pad arrives rather than switches on. */
const FADE_SECONDS = 3;

export function Ambience({ enabled }: { enabled: boolean }) {
  const [on, setOn] = useState(true);
  const [ready, setReady] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Fetched only once the scene has its frames, so it never competes with the atlas for bandwidth.
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(TRACK_URL);
        if (!res.ok) {
          throw new Error(`Ambience request failed with status ${res.status}`);
        }
        const encoded = await res.arrayBuffer();
        // Older Safari only exposes the prefixed constructor.
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) throw new Error("This browser has no Web Audio support.");
        const ctx = new Ctor();
        // Callback form as well as the promise: Safari resolved decodeAudioData by callback long
        // before it returned a promise, and still honours it.
        const buffer = await new Promise<AudioBuffer>((resolve, reject) => {
          ctx.decodeAudioData(encoded, resolve, reject);
        });
        if (cancelled) {
          void ctx.close();
          return;
        }
        ctxRef.current = ctx;
        bufferRef.current = buffer;
        setReady(true);
        console.log("ambience: decoded", {
          seconds: Number(buffer.duration.toFixed(2)),
          rate: buffer.sampleRate,
        });
      } catch (err) {
        console.error("ambience: could not load the background loop", {
          url: TRACK_URL,
          err,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    const source = sourceRef.current;
    if (!ctx || !gain || !source) return;
    const end = ctx.currentTime + 0.6;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, end);
    source.stop(end + 0.05);
    sourceRef.current = null;
  }, []);

  const start = useCallback(() => {
    const ctx = ctxRef.current;
    const buffer = bufferRef.current;
    if (!ctx || !buffer || sourceRef.current) return;

    try {
      // Autoplay policy parks a context created before any gesture in "suspended".
      void ctx.resume();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + FADE_SECONDS);
      gain.connect(ctx.destination);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();

      gainRef.current = gain;
      sourceRef.current = source;
    } catch (err) {
      console.error("ambience: could not start playback", { err });
    }
  }, []);

  // Sound needs a gesture, and the piece already asks for one. The first scroll doubles as consent.
  useEffect(() => {
    if (!ready || !on) return;

    const begin = () => {
      start();
      for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
        window.removeEventListener(type, begin);
      }
    };
    for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
      window.addEventListener(type, begin, { passive: true });
    }
    return () => {
      for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
        window.removeEventListener(type, begin);
      }
    };
  }, [ready, on, start]);

  useEffect(() => {
    return () => {
      sourceRef.current?.stop();
      void ctxRef.current?.close();
    };
  }, []);

  if (!enabled || !ready) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const next = !on;
        setOn(next);
        if (next) start();
        else stop();
      }}
      title="Lo-Fi Space Ambient Drone Music by Forgotten Dawn (CC BY 3.0)"
      aria-label={on ? "Mute background sound" : "Unmute background sound"}
      aria-pressed={on}
      className="pointer-events-auto absolute bottom-5 right-5 z-40 flex h-9 items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 text-[10px] uppercase tracking-[0.28em] text-white/55 backdrop-blur transition-colors hover:text-white/90"
    >
      <span aria-hidden className="flex items-end gap-[2px]">
        {[8, 13, 6].map((h, i) => (
          <span
            key={h}
            style={{
              height: on ? h : 3,
              animation: on
                ? `ambience-bar 1.${4 + i}s ease-in-out ${i * 0.2}s infinite`
                : undefined,
            }}
            className="w-[2px] bg-current transition-[height] duration-300"
          />
        ))}
      </span>
      {on ? "Sound" : "Muted"}
      <style>
        {"@keyframes ambience-bar{0%,100%{transform:scaleY(1)}50%{transform:scaleY(0.45)}}"}
      </style>
    </button>
  );
}
