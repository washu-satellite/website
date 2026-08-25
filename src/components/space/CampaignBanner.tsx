import { Link } from "@tanstack/react-router";
import { ArrowRight, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * TEMPORARY. Homepage promo for the /space campaign. Delete this file, its import, and its one use
 * in routes/index.tsx when the campaign ends.
 */
export default function CampaignBanner() {
  return (
    <div className="px-4 py-6 md:px-[4rem]">
      <Link
        to="/space"
        className={cn(
          "group flex flex-col gap-4 rounded-md border border-border bg-background p-6",
          "shadow-sm transition-colors hover:bg-bg-highlight dark:shadow-none",
          "sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent-red">
            <Ticket aria-hidden className="h-4 w-4" />
            Open to everyone
          </span>
          <span className="font-mono text-xl font-medium text-foreground">
            Want to go to space?
          </span>
          <span className="text-sm text-foreground/80">
            We will engrave your name on SCALAR before it launches in January 2027.
          </span>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-2 rounded-md",
            "px-4 py-2 font-mono text-sm font-semibold uppercase tracking-wider",
            "bg-accent-red text-white transition-all duration-300 group-hover:bg-accent-red-hover",
          )}
        >
          Get my ticket
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[3px]"
          />
        </span>
      </Link>
    </div>
  );
}
