import clsx from "clsx";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import GenericPage from "@/components/GenericPage";
import { Badge } from "@/components/ui/badge";
import { MemberList } from "@/components/MemberList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  members,
  slugify,
  teamNames,
  type Member,
} from "@/const/content/members";

type SortMode = "subteam" | "alphabetical";

const SORT_LABELS: Record<SortMode, string> = {
  subteam: "Exec first",
  alphabetical: "Alphabetical",
};

export const Route = createFileRoute("/team/")({
  component: TeamPage,
});

export const TeamTile = (props: Member) => {
  return (
    <Link
      to={"/team/people/$user_slug"}
      params={{ user_slug: slugify(props.name) }}
      className={clsx(
        "border-border border shadow-sm dark:shadow-none bg-background rounded-md",
        "flex flex-row items-start justify-between gap-3 font-mono",
        "w-full md:w-[16rem] p-4 hover:border-primary/60 transition-colors",
      )}
    >
      <div className="flex flex-col min-w-0">
        <h3 className="font-sans font-medium truncate">{props.name}</h3>
        <p className="text-sm font-sans text-foreground/80 truncate">
          {props.teams.join(" · ")}
        </p>
      </div>
      {props.isAdmin && (
        <Badge className="bg-primary/50 text-primary-foreground border-primary/70 font-sans shrink-0">
          Admin
        </Badge>
      )}
    </Link>
  );
};

function SortDropdown(props: {
  value: SortMode;
  onChange: (v: SortMode) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-xs uppercase text-foreground/60">
        Sort
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row items-center justify-between gap-2 bg-input/30 border-input border px-3 py-1.5 rounded-md text-sm min-w-[10rem]">
          <span>{SORT_LABELS[props.value]}</span>
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-border min-w-[10rem]">
          <DropdownMenuGroup>
            {(Object.keys(SORT_LABELS) as SortMode[]).map((s) => (
              <DropdownMenuItem key={s} onClick={() => props.onChange(s)}>
                {SORT_LABELS[s]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TeamPage() {
  const [sortMode, setSortMode] = useState<SortMode>("subteam");
  const [teamFilter, setTeamFilter] = useState<string | null>(null);

  // Filter by the URL hash set from the nav dropdown (e.g. /team#exec).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const h = window.location.hash.replace(/^#/, "");
      setTeamFilter(h || null);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const teamLabel = useMemo(() => {
    if (!teamFilter) return null;
    return teamNames().find((t) => slugify(t) === teamFilter) ?? teamFilter;
  }, [teamFilter]);

  const filtered = useMemo(() => {
    if (!teamFilter) return members;
    return members.filter((m) =>
      m.teams.some((t) => slugify(t) === teamFilter),
    );
  }, [teamFilter]);

  const sorted = useMemo(() => {
    if (sortMode === "alphabetical") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered;
  }, [filtered, sortMode]);

  return (
    <GenericPage
      title={teamLabel ? `${teamLabel} Team` : "Our Team"}
      headerContent={
        <p>
          {teamLabel
            ? `Members of the ${teamLabel} subteam`
            : "The folks who make it all happen"}
        </p>
      }
    >
      <div className="z-10 bg-bg px-[4rem] pt-4 pb-[4rem] flex flex-col gap-4">
        <div className="flex flex-row flex-wrap items-end gap-4 border-b border-border pb-4">
          <SortDropdown value={sortMode} onChange={setSortMode} />
          {teamFilter && (
            <a
              href="/team"
              onClick={(e) => {
                e.preventDefault();
                history.replaceState(null, "", "/team");
                setTeamFilter(null);
              }}
              className="text-sm text-foreground/70 hover:text-foreground underline underline-offset-2"
            >
              Clear subteam filter
            </a>
          )}
          <p className="text-sm text-foreground/60 ml-auto">
            {sorted.length} {sorted.length === 1 ? "member" : "members"}
          </p>
        </div>

        {sortMode === "subteam" && !teamFilter ? (
          <MemberList members={sorted} />
        ) : (
          <div className="flex flex-row flex-wrap justify-start gap-4">
            {sorted.map((m) => (
              <TeamTile key={m.name} {...m} />
            ))}
          </div>
        )}
      </div>
    </GenericPage>
  );
}
