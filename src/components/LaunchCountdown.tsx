import { useEffect, useState } from "react";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export type Launch = {
  name: string;
  /** ISO date — set to undefined when TBD. */
  target?: string;
  blurb?: string;
};

// Edit these as launch dates firm up. Setting target to undefined renders
// a "TBD" state instead of a countdown.
export const LAUNCHES: Launch[] = [
  {
    name: "AIRIS",
    target: "2026-12-01T00:00:00Z",
    blurb: "Antarctic balloon flight (target — pending NASA decision)",
  },
  {
    name: "SCALAR",
    target: "2027-02-01T00:00:00Z",
    blurb: "Planned 1U CubeSat launch (early 2027)",
  },
];

function diff(target: Date) {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return null;
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

function CountdownCell(props: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[3.5rem]">
      <span className="font-mono font-semibold text-2xl md:text-3xl tabular-nums text-foreground">
        {String(props.value).padStart(2, "0")}
      </span>
      <span className="font-mono uppercase text-[0.6rem] tracking-wider text-foreground/60">
        {props.label}
      </span>
    </div>
  );
}

function LaunchTile({ launch }: { launch: Launch }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!launch.target) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
    // re-arm if the target itself changes
  }, [launch.target]);

  const target = launch.target ? new Date(launch.target) : null;
  const remaining = target ? diff(target) : null;
  const isLaunched = !!target && remaining === null;

  return (
    <div
      className={cn(
        "flex-1 min-w-[16rem] rounded-md border border-border bg-background p-4",
        "flex flex-col gap-3",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="rounded-full bg-red-500/40 p-2">
          <Rocket className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-mono uppercase text-sm font-semibold tracking-wide">
            {launch.name}
          </h3>
          {launch.blurb && (
            <p className="text-xs text-foreground/60">{launch.blurb}</p>
          )}
        </div>
      </div>

      {remaining ? (
        <div className="flex flex-row gap-2 justify-between items-end">
          <CountdownCell value={remaining.days} label="Days" />
          <CountdownCell value={remaining.hours} label="Hrs" />
          <CountdownCell value={remaining.minutes} label="Min" />
          <CountdownCell value={remaining.seconds} label="Sec" />
        </div>
      ) : isLaunched ? (
        <p className="font-mono uppercase text-sm text-green-500">Launched</p>
      ) : (
        <p className="font-mono uppercase text-sm text-foreground/50">
          T-minus TBD
        </p>
      )}
      {target && (
        <p className="font-mono text-[0.65rem] uppercase text-foreground/50">
          Target: {target.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
        </p>
      )}
      {/* keep `now` referenced so the interval re-renders */}
      <span className="hidden">{now}</span>
    </div>
  );
}

export default function LaunchCountdown(props: { launches?: Launch[] }) {
  const list = props.launches ?? LAUNCHES;
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {list.map((l) => (
        <LaunchTile key={l.name} launch={l} />
      ))}
    </div>
  );
}
