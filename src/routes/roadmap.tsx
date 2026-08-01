import { createFileRoute } from "@tanstack/react-router";
import GenericPage from "@/components/GenericPage";
import { roadmap, type RoadmapStatus } from "@/const/content/roadmap";
import { cn } from "@/lib/utils";
import { CircleDashed, CircleDot, CircleCheck } from "lucide-react";

export const Route = createFileRoute("/roadmap")({
  component: RoadmapPage,
});

const STATUS_META: Record<
  RoadmapStatus,
  { label: string; className: string; Icon: typeof CircleCheck }
> = {
  done: {
    label: "Done",
    className: "text-green-500 border-green-500/40 bg-green-500/10",
    Icon: CircleCheck,
  },
  active: {
    label: "In progress",
    className: "text-amber-500 border-amber-500/40 bg-amber-500/10",
    Icon: CircleDot,
  },
  planned: {
    label: "Planned",
    className: "text-foreground/70 border-border bg-background",
    Icon: CircleDashed,
  },
};

function RoadmapPage() {
  return (
    <GenericPage
      title="Roadmap"
      headerContent={
        <p className="text-center">
          Where we&rsquo;ve been, where we are, and where we&rsquo;re going.
        </p>
      }
    >
      <div className="px-[4rem] py-8 flex flex-col gap-3">
        {roadmap.map((r, i) => {
          const meta = STATUS_META[r.status];
          const { Icon } = meta;
          return (
            <div
              key={`${r.date}-${i}`}
              className="flex flex-row gap-4 items-start border border-border rounded-md bg-background p-4"
            >
              <div className={cn("rounded-full p-2 border", meta.className)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col flex-1 gap-1 min-w-0">
                <div className="flex flex-row flex-wrap items-baseline gap-2">
                  <span className="font-mono text-xs uppercase text-foreground/60">
                    {r.date}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[0.6rem] uppercase tracking-wider px-1.5 py-0.5 rounded border",
                      meta.className,
                    )}
                  >
                    {meta.label}
                  </span>
                </div>
                <h3 className="font-sans font-medium">{r.title}</h3>
                {r.description && (
                  <p className="text-sm text-foreground/80">{r.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </GenericPage>
  );
}
