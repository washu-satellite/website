import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * TEMPORARY. The campaign's entry point, sitting in the homepage hero over the video. It replaced a
 * navbar link, so it is the only way in from the homepage and has to carry that on its own.
 *
 * Glass panel rather than a solid card: it sits on the hero video and has to stay readable over
 * whatever frame is behind it, the same trick the "Student-developed" pill above it uses.
 */
export default function HeroCallout() {
  return (
    <Link
      to="/space"
      className={cn(
        // Hugs its content once there is room, so losing the body line does not leave a wide empty
        // panel. Still full width on a phone, where it is the page's main control.
        "group mt-6 flex w-full flex-col items-start gap-3 rounded-xl sm:w-fit",
        "border border-[#222] bg-[#111]/50 px-5 py-5 backdrop-blur-3xl sm:px-6",
        "text-left transition-colors duration-300 hover:border-accent-red",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-red",
      )}
    >
      <span className="font-mono text-xs uppercase tracking-wider text-accent-red">
        Open to everyone
      </span>

      <span className="text-3xl font-black leading-tight text-white md:text-4xl">
        Want to go to space?
      </span>

      <span
        className={cn(
          "mt-1 inline-flex items-center gap-2 rounded-md bg-accent-red px-4 py-2",
          "font-mono text-sm font-semibold uppercase tracking-wider text-white",
          "transition-all duration-300 group-hover:bg-accent-red-hover",
        )}
      >
        Add your name
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[3px]"
        />
      </span>
    </Link>
  );
}
