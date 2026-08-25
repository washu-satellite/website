"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  drawBoardingPass,
  manifestIdFor,
  passFilename,
  PASS_H,
  PASS_W,
} from "@/lib/ticket/boardingPass";
import { jpegToPdf } from "@/lib/ticket/pdf";
import { MAX_NAME_LENGTH } from "@/lib/ticket/signupSchema";

/**
 * Deliberately imprecise, and the only place this page states a date. We are not free to publish a
 * launch month for SCALAR, so this matches the roadmap entry and the project fact sheet. Widen it,
 * never narrow it, until the launch provider clears an exact date.
 */
export const LAUNCH_WINDOW = "Early 2027";

/**
 * Survives a reload so someone returning to the page gets their pass back rather than an empty form
 * inviting them to claim a second one. Not a security boundary -- clearing it just re-shows the
 * form, and the server holds the real manifest.
 */
const CLAIMED_KEY = "wusat.space.claimed";

type Claimed = { name: string };

type Status = "idle" | "sending" | "done";

function readClaimed(): Claimed | null {
  try {
    const raw = window.localStorage.getItem(CLAIMED_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Claimed>;
    return typeof parsed.name === "string" && parsed.name.length > 0
      ? { name: parsed.name }
      : null;
  } catch (err) {
    // Corrupt or blocked localStorage should cost the visitor a form, not the page.
    console.error("TicketClaim: could not read stored claim", { err });
    return null;
  }
}

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  // Revoking in the same tick cancels the download in some browsers; one frame is enough.
  requestAnimationFrame(() => URL.revokeObjectURL(url));
}

const fieldClass = cn(
  "w-full rounded-md border border-border bg-background",
  "px-3 py-3 text-base outline-none transition-colors",
  "placeholder:text-foreground/40",
  "focus-visible:border-accent-red focus-visible:ring-[3px] focus-visible:ring-accent-red/25",
  "aria-[invalid=true]:border-destructive",
);

const labelClass = "font-mono text-xs uppercase tracking-wider text-foreground/60";

const primaryButton = cn(
  "group inline-flex items-center justify-center gap-2 rounded-md",
  "px-4 py-3 font-mono text-sm font-semibold uppercase tracking-wider",
  "bg-accent-red text-white hover:bg-accent-red-hover",
  "shadow-sm transition-all duration-300 hover:shadow-md",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-red",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

const secondaryButton = cn(
  "group inline-flex items-center justify-center gap-2 rounded-md border border-border",
  "px-4 py-3 font-mono text-sm font-semibold uppercase tracking-wider",
  "text-foreground/80 transition-colors duration-200 hover:bg-bg-highlight hover:text-foreground",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-red",
);

export default function TicketClaim() {
  const [status, setStatus] = useState<Status>("idle");
  const [claimed, setClaimed] = useState<Claimed | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // localStorage does not exist during SSR, so a restored pass can only resolve after mount.
  useEffect(() => {
    const stored = readClaimed();
    if (stored) {
      setClaimed(stored);
      setStatus("done");
    }
  }, []);

  const passenger = claimed?.name ?? "";
  const manifestId = passenger ? manifestIdFor(passenger) : "";

  useEffect(() => {
    if (!passenger || !canvasRef.current) return;
    try {
      drawBoardingPass(canvasRef.current, {
        passenger,
        manifestId,
        window: LAUNCH_WINDOW,
      });
    } catch (err) {
      console.error("TicketClaim: could not draw the boarding pass", {
        passenger,
        err,
      });
    }
  }, [passenger, manifestId]);

  const submit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      if (!trimmedName) return setError("Enter the name you want on the manifest.");
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return setError("Enter an email so we can reach you about the launch.");
      }

      setError(null);
      setStatus("sending");

      try {
        const response = await fetch("/api/ticket-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            newsletter,
            source: "space",
          }),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(body?.error ?? `The server replied ${response.status}.`);
        }

        try {
          window.localStorage.setItem(
            CLAIMED_KEY,
            JSON.stringify({ name: trimmedName }),
          );
        } catch (err) {
          // Not worth failing the claim over; it is already saved server-side.
          console.error("TicketClaim: could not persist the claim locally", { err });
        }

        setClaimed({ name: trimmedName });
        setStatus("done");
      } catch (err) {
        console.error("TicketClaim: signup failed", { name: trimmedName, err });
        setError(
          err instanceof Error
            ? `We could not add your name: ${err.message}`
            : "We could not add your name. Try again in a moment.",
        );
        setStatus("idle");
      }
    },
    [name, email, newsletter],
  );

  const downloadPdf = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !passenger) return;
    try {
      // 0.92 keeps the crimson rail and the hairlines clean without a multi-megabyte attachment.
      const jpeg = canvas.toDataURL("image/jpeg", 0.92);
      save(
        jpegToPdf(jpeg, PASS_W, PASS_H),
        passFilename(passenger).replace(/\.png$/, ".pdf"),
      );
    } catch (err) {
      console.error("TicketClaim: could not build the PDF", { passenger, err });
      setError("The PDF would not generate. Try the image instead.");
    }
  }, [passenger]);

  const downloadPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !passenger) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("TicketClaim: canvas produced no PNG blob", { passenger });
        setError("The image would not generate. Try the PDF instead.");
        return;
      }
      save(blob, passFilename(passenger));
    }, "image/png");
  }, [passenger]);

  if (status === "done" && claimed) {
    return (
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-accent-red">
          <Check aria-hidden className="h-4 w-4" />
          You are on the manifest
        </div>

        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Boarding pass for ${claimed.name}, manifest ${manifestId}, mission SCALAR, launch window ${LAUNCH_WINDOW}`}
          className="h-auto w-full rounded-md border border-border shadow-sm"
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={downloadPdf} className={cn(primaryButton, "flex-1")}>
            <Download aria-hidden className="h-4 w-4" />
            Download PDF
          </button>
          <button type="button" onClick={downloadPng} className={cn(secondaryButton, "flex-1")}>
            <Download aria-hidden className="h-4 w-4" />
            Download image
          </button>
        </div>

        {error && (
          <p role="alert" className="text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <p className="text-center text-xs text-foreground/60">
          On a phone you can also press and hold the ticket to save it. Post it
          and tag @washusatellite.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="space-name" className={labelClass}>
          Name on the manifest
        </label>
        <input
          id="space-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_NAME_LENGTH}
          autoComplete="name"
          enterKeyHint="next"
          placeholder="Ada Lovelace"
          aria-invalid={error !== null && name.trim() === ""}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="space-email" className={labelClass}>
          Email
        </label>
        <input
          id="space-email"
          name="email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          enterKeyHint="go"
          placeholder="you@example.com"
          aria-invalid={error !== null && name.trim() !== ""}
          className={fieldClass}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground/80">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="mt-[3px] h-4 w-4 shrink-0 accent-accent-red"
        />
        <span>
          Email me updates on the build and the launch. A few times a year, and
          every one of them has an unsubscribe link.
        </span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className={primaryButton}>
        {status === "sending" ? (
          <>
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            Adding you
          </>
        ) : (
          <>
            Get my boarding pass
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[3px]"
            />
          </>
        )}
      </button>
    </form>
  );
}
