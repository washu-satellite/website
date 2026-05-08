import clsx from "clsx";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import * as z from "zod";
import GenericPage from "@/components/GenericPage";
import { MemberList } from "@/components/MemberList";
import { MemberAvatar } from "@/components/MemberAvatar";
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

const teamSearchSchema = z.object({
  team: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/team/")({
  component: TeamPage,
  validateSearch: teamSearchSchema,
});

export const TeamTile = (props: Member) => {
  return (
    <Link
      to={"/team/people/$user_slug"}
      params={{ user_slug: slugify(props.name) }}
      className={clsx(
        "border-border border shadow-sm dark:shadow-none bg-background rounded-md",
        "flex flex-row items-center gap-3 font-mono",
        "w-full md:w-[16rem] p-3 hover:border-primary/60 transition-colors",
      )}
    >
      <MemberAvatar member={props} size="size-12" />
      <div className="flex flex-col min-w-0 flex-1">
        <h3 className="font-sans font-medium truncate">{props.name}</h3>
        {props.role && (
          <p className="text-sm font-sans text-foreground/90 truncate">
            {props.role}
          </p>
        )}
        <p className="text-xs font-sans text-foreground/60 truncate">
          {props.teams.join(" · ")}
        </p>
      </div>
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

  // Subteam filter is a search param: /team?team=exec. Tanstack Router
  // re-renders whenever validated search changes, so switching subteams
  // from the nav dropdown works even when already on /team.
  const { team: teamParam } = Route.useSearch();
  const teamFilter = teamParam ?? null;

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
            <Link
              to="/team"
              search={{}}
              className="text-sm text-foreground/70 hover:text-foreground underline underline-offset-2"
            >
              Clear subteam filter
            </Link>
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
