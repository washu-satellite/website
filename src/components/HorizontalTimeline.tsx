import { useLayoutEffect, useRef } from "react";
import {
  Antenna,
  Balloon,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  NotebookText,
  Rocket,
  Satellite,
} from "lucide-react";
import {
  chronologicalRoadmap,
  type RoadmapIcon,
  type RoadmapItem,
} from "@/const/content/roadmap";
import { cn } from "@/lib/utils";

const ICONS: Record<RoadmapIcon, typeof Rocket> = {
  rocket: Rocket,
  balloon: Balloon,
  antenna: Antenna,
  notebook: NotebookText,
  satellite: Satellite,
  file: FileCheck,
};

const STATUS_LABEL: Record<RoadmapItem["status"], string> = {
  done: "Done",
  active: "In progress",
  planned: "Planned",
};

/** "YYYY-MM" for right now, to compare against RoadmapItem.sort. */
function currentSortKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function Card({
  item,
  isNow,
  ref,
}: {
  item: RoadmapItem;
  isNow: boolean;
  ref?: React.Ref<HTMLLIElement>;
}) {
  const Icon = ICONS[item.icon ?? "rocket"];
  const past = item.status === "done";

  return (
    <li
      ref={ref}
      className={cn(
        "relative snap-center shrink-0 w-[17rem] pt-12",
        past && "opacity-70",
      )}
    >
      {/* The axis is drawn per-card and bleeds into the gap, because an
          absolutely positioned line on the scroll container would only span
          one viewport width rather than the full scroll width. */}
      <div
        aria-hidden
        className="absolute top-[2.4rem] left-0 -right-4 h-[2px] bg-secondary"
      />

      <div className="absolute z-10 top-[2.4rem] left-8 -translate-x-1/2 -translate-y-1/2">
        <div
          className={cn(
            "rounded-full p-2 border-2 bg-background",
            item.status === "active"
              ? "border-accent-red text-accent-red"
              : "border-secondary text-foreground/70",
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div
        className={cn(
          "h-full rounded-md border bg-background p-4 flex flex-col gap-2",
          isNow ? "border-accent-red" : "border-border",
        )}
      >
        <div className="flex flex-row items-baseline justify-between gap-2">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/60">
            {item.date}
          </p>
          <p
            className={cn(
              "font-mono text-[0.6rem] uppercase tracking-wider",
              item.status === "active"
                ? "text-accent-red"
                : "text-foreground/50",
            )}
          >
            {STATUS_LABEL[item.status]}
          </p>
        </div>
        <h5 className="font-semibold leading-snug">{item.title}</h5>
        {item.description && (
          <p className="text-sm text-foreground/80">{item.description}</p>
        )}
      </div>
    </li>
  );
}

export default function HorizontalTimeline({
  items = chronologicalRoadmap,
}: {
  items?: RoadmapItem[];
}) {
  const scroller = useRef<HTMLOListElement>(null);
  const anchor = useRef<HTMLLIElement>(null);

  const nowKey = currentSortKey();
  // Open on whatever we're working on now. Several things run in parallel, so
  // take the furthest-along active item — that's the leading edge of the work.
  // Falling back to the first item we haven't reached yet keeps this sane if
  // nothing is marked active.
  // (not findLastIndex — tsconfig targets ES2022, which predates it)
  let activeIndex = -1;
  items.forEach((item, i) => {
    if (item.status === "active") activeIndex = i;
  });
  const nextIndex = items.findIndex((i) => i.sort > nowKey);
  const anchorIndex =
    activeIndex !== -1
      ? activeIndex
      : nextIndex !== -1
        ? nextIndex
        : items.length - 1;

  // useLayoutEffect so the jump to "now" happens before paint — otherwise the
  // timeline visibly flicks from 2024 to the present on load. Setting
  // scrollLeft directly (rather than scrollIntoView) keeps the page itself
  // from scrolling to this section on mount.
  //
  // Re-run on the next frame as well: the router restores scroll positions
  // after hydration and will otherwise stomp this back to 0.
  useLayoutEffect(() => {
    const center = () => {
      const box = scroller.current;
      const target = anchor.current;
      if (!box || !target) return;
      box.scrollLeft =
        target.offsetLeft - box.clientWidth / 2 + target.offsetWidth / 2;
    };
    center();
    const frame = requestAnimationFrame(center);
    return () => cancelAnimationFrame(frame);
  }, [anchorIndex]);

  const nudge = (direction: 1 | -1) => {
    const box = scroller.current;
    if (!box) return;
    box.scrollBy({ left: direction * box.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="flex flex-row items-center justify-between px-1 pb-2">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/50">
          ← Past
        </p>
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/50">
          Future →
        </p>
      </div>

      <ol
        ref={scroller}
        // relative so each card's offsetLeft is measured against this box.
        className={cn(
          // No scroll-smooth here: it would animate the initial jump to "now"
          // instead of landing there. The arrow buttons opt in explicitly.
          "relative flex flex-row gap-4 overflow-x-auto snap-x",
          "pb-4 px-2",
        )}
        aria-label="Mission timeline, earliest to latest"
      >
        {items.map((item, i) => (
          <Card
            key={`${item.sort}-${item.title}`}
            item={item}
            isNow={i === anchorIndex}
            ref={i === anchorIndex ? anchor : undefined}
          />
        ))}
      </ol>

      <div className="flex flex-row justify-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Scroll timeline toward the past"
          className="rounded-md border border-border p-2 hover:bg-secondary/20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Scroll timeline toward the future"
          className="rounded-md border border-border p-2 hover:bg-secondary/20 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
