import { useEffect, useRef, useState } from "react";
import { MAX_NAME_LENGTH } from "@/lib/ticket/signupSchema";

type Status = "idle" | "submitting" | "saved";

/** Sized to the ticket's left panel so nothing crosses the printed perforation. */
const FORM_WIDTH = 430;

/** Locked so the measured box never changes; see the note on the form element. */
const FORM_HEIGHT = 52;

/** Matches the handwriting already printed on the card, so typing continues it rather than replies to it. */
const HAND = "'Segoe Script', 'Bradley Hand', 'Brush Script MT', cursive";

/** Beat between the sequence landing and the caret arming itself, so the field is not grabbed mid-glide. */
const AUTOFOCUS_DELAY_MS = 500;

/**
 * The card is photographed at an angle, so its printed rule is not level: fitted across the dashes
 * on the plate it falls 2.035 degrees from left to right. The ink is laid at the same angle, pivoting
 * from where the writing starts, so the name sits along the line instead of drifting off it.
 */
const RULE_ANGLE = "2.03deg";

/**
 * Distance from the field's left edge to the first letter. The rule begins at u=0.2133 of the frame
 * while the field starts at u=0.18, and at this width that gap is 25px -- without it the name starts
 * out over bare card, short of the line it is meant to be written on.
 */
const INK_INSET = 25;

/**
 * Drop from the field's vertical centre down to the printed rule, at the caret's position, in field
 * pixels. The field is centred on NAME.v while the rule at that x sits lower, and the caret rests
 * its foot on the line the way a pen would rather than floating mid-field. Derived rather than
 * eyeballed: the rule falls 0.0474 of a frame height per frame width, which puts it 0.0154 below
 * the field's centre at u=0.2137, and the field spans 556 pixels per unit of frame height.
 */
const RULE_DROP = 8.6;
const CARET_HEIGHT = 30;
const BUTTON_HEIGHT = 34;

/**
 * Sampled off the plate: the card's printed hairlines, its filled PASSENGER tab, and the body it all
 * sits on. The button was amber-200 (#fde68a), which is brighter and yellower than anything actually
 * printed on the ticket, so it read as pasted on top rather than run off the same press.
 */
const RULE_GOLD = "#aa8539";
const TAB_GOLD = "#ddc06c";
const CARD_BODY = "#373c52";

/**
 * Everything this form needs arrives as props. drei's <Html> portals its children out of the
 * react-three-fiber tree, and React context does not survive that hop -- reading the scroll
 * context here throws "must be used inside <ScrollProvider>".
 */
export function TicketForm({
  interactive,
  settled,
  onSaved,
  setScrollLocked,
  confirmedName,
}: {
  interactive: boolean;
  /** The sequence has landed, so the field can take focus without being clicked. */
  settled: boolean;
  onSaved: (name: string) => void;
  setScrollLocked: (locked: boolean) => void;
  /** Set once saved. The ticket is now a video and cannot restamp itself, so the name is drawn here. */
  confirmedName?: string | null;
}) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const claimedFocus = useRef(false);
  const focusingOurselves = useRef(false);

  // Releases the scroll lock if the form unmounts while the input still holds focus.
  useEffect(() => () => setScrollLocked(false), [setScrollLocked]);

  // Arms the caret once the ticket has settled, so you can type straight away, and so a phone
  // raises its keyboard without having to find and tap a borderless line.
  useEffect(() => {
    if (!settled || !interactive || claimedFocus.current) return;

    const timer = window.setTimeout(() => {
      const el = inputRef.current;
      if (!el || el.disabled) return;
      // Never take focus off something the reader chose themselves.
      const active = document.activeElement;
      if (active && active !== document.body && active !== document.documentElement) {
        return;
      }
      claimedFocus.current = true;
      focusingOurselves.current = true;
      try {
        // preventScroll matters here: the field lives inside a 3D-transformed overlay, and letting
        // the browser scroll it into view would drag the page off the end of the sequence.
        el.focus({ preventScroll: true });
        console.log("signup: field armed for typing");
      } catch (err) {
        console.error("signup: could not focus the passenger field", { err });
      } finally {
        focusingOurselves.current = false;
      }
    }, AUTOFOCUS_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [settled, interactive]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter a name to claim the ticket.");
      inputRef.current?.focus();
      return;
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      setError(`Keep it under ${MAX_NAME_LENGTH} characters.`);
      return;
    }

    setStatus("submitting");
    setError(null);
    console.log("signup: submitting", { name: trimmed });

    try {
      const res = await fetch("/api/ticket-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      const payload = await res.json().catch((err: unknown) => {
        throw new Error("The server sent a response we could not read.", {
          cause: err,
        });
      });

      if (!res.ok) {
        throw new Error(
          typeof payload?.error === "string"
            ? payload.error
            : `Signup failed with status ${res.status}.`,
        );
      }

      console.log("signup: saved", { name: trimmed });
      setStatus("saved");
      onSaved(trimmed);
    } catch (err) {
      console.error("signup: submit failed", { name: trimmed, err });
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong saving your name.",
      );
    }
  }

  const locked = !interactive || status === "submitting";

  if (status === "saved") {
    const written = confirmedName ?? name.trim();
    return (
      <div
        style={{
          width: FORM_WIDTH,
          height: FORM_HEIGHT,
          pointerEvents: "none",
        }}
      >
        {/* Sits directly on the ticket's printed dashed line, styled to read as handwriting. No rule
            is drawn under it: the card already prints one, and a level CSS border laid over a rule
            that falls two degrees reads as two separate lines. */}
        <p
          className="truncate text-[30px] leading-none text-white"
          style={{
            fontFamily: HAND,
            paddingLeft: INK_INSET,
            transform: `rotate(${RULE_ANGLE})`,
            transformOrigin: "left center",
          }}
        >
          {written}
        </p>
        <span role="status" aria-live="polite" className="sr-only">
          Confirmed. Your seat is held, {written}.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      // Fixed height, and the error is taken out of flow. drei's Html centres on the measured box,
      // so anything changing this element's height after mount re-centres it -- which is why the
      // field settled correctly and then slid down a moment later.
      style={{
        width: FORM_WIDTH,
        height: FORM_HEIGHT,
        position: "relative",
        pointerEvents: interactive ? "auto" : "none",
      }}
      // Keeps a click on the input from also raycasting the ticket behind it.
      onPointerDown={(e) => e.stopPropagation()}
      className="font-sans"
      aria-hidden={!interactive}
      // @ts-expect-error inert lands as an attribute; React 19 types still lag on it.
      inert={!interactive ? "" : undefined}
    >
      {/* The ticket already prints "PASSENGER" above this field, so the visible label would be a
          duplicate. Screen readers still get one. */}
      <label htmlFor="passenger-name" className="sr-only">
        Passenger name
      </label>

      {/* The whole row leans with the rule, not just the ink -- the button sits on the same printed
          line, so leaving it level left the line entering one side of it and leaving the other a
          dozen pixels lower. Pivoting from the left keeps the first letter where it was placed. */}
      <div
        className="flex h-full items-center gap-2"
        style={{
          transform: `rotate(${RULE_ANGLE})`,
          transformOrigin: "left center",
        }}
      >
        {/* No box. The card already prints the rule to write on, so the field is just the ink --
            the only affordance is a cursor blinking where the pen would go. */}
        <div className="relative min-w-0 flex-1">
          <input
            id="passenger-name"
            ref={inputRef}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            onFocus={() => {
              setFocused(true);
              // Only a focus the reader asked for freezes the page. Locking on the automatic one
              // would strand them at the end of the sequence, unable to scroll back up it.
              if (!focusingOurselves.current) setScrollLocked(true);
            }}
            onBlur={() => {
              setFocused(false);
              setScrollLocked(false);
            }}
            disabled={locked}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="name"
            spellCheck={false}
            placeholder=""
            style={{
              fontFamily: HAND,
              caretColor: "#ffffff",
              paddingLeft: INK_INSET,
              paddingRight: 4,
            }}
            className="h-[46px] w-full border-0 bg-transparent text-[30px] leading-none text-white outline-none disabled:opacity-50"
          />
          {/* Stands in for the caret before the field has focus -- otherwise an empty borderless
              line gives no sign it can be typed on. Hidden once focused, where the real one takes over. */}
          {!focused && !name && (
            <span
              aria-hidden
              className="pointer-events-none absolute w-[2px] bg-white"
              style={{
                left: INK_INSET,
                top: "50%",
                height: CARET_HEIGHT,
                // Foot on the rule, not centred in the field. The typed text still rides above the
                // line -- it is the caret that has to look like it is standing on it.
                transform: `translateY(${RULE_DROP - CARET_HEIGHT}px)`,
                animation: "ticket-caret 1.06s steps(1) infinite",
              }}
            />
          )}
          {/* Hover lives here rather than in a utility class: the button carries its colours as
              inline style, which would win over one. */}
          <style>
            {"@keyframes ticket-caret{0%,50%{opacity:1}50.01%,100%{opacity:0}}" +
              ".ticket-claim:hover:not(:disabled){background:" +
              TAB_GOLD +
              " !important;color:var(--hover-ink) !important}"}
          </style>
        </div>
        {/* Drawn like something printed on the card rather than a control laid over it: the same
            hairline gold as the rules, the tab's gold for the ink, small caps and wide tracking to
            match PASSENGER. Hover inks it in solid, which is also what makes it read as pressable. */}
        <button
          type="submit"
          disabled={locked}
          style={{
            borderColor: RULE_GOLD,
            color: TAB_GOLD,
            backgroundColor: "rgba(221,192,108,0.10)",
            ["--hover-ink" as string]: CARD_BODY,
            height: BUTTON_HEIGHT,
            // Rests on the rule, like the writing does. Centred in the row the line cut through its
            // lower third, which reads as an accident rather than as something printed there.
            transform: `translateY(${RULE_DROP - BUTTON_HEIGHT / 2}px)`,
          }}
          className="ticket-claim shrink-0 rounded-[3px] border px-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
        >
          {status === "submitting" ? "Saving" : "Claim"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="absolute left-0 top-full mt-1 text-[15px] text-rose-300"
        >
          {error}
        </p>
      )}
    </form>
  );
}
