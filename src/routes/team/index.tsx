import clsx from "clsx";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
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

type SortMode = "subteam" | "alphabetical" | "admins";

const SORT_LABELS: Record<SortMode, string> = {
  subteam: "By subteam",
  alphabetical: "Alphabetical",
  admins: "Admins first",
};

const ALL_TEAMS = "__all__";

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

function FilterDropdown(props: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const current =
    props.options.find((o) => o.value === props.value)?.label ?? props.value;

  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-xs uppercase text-foreground/60">
        {props.label}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row items-center justify-between gap-2 bg-input/30 border-input border px-3 py-1.5 rounded-md text-sm min-w-[12rem]">
          <span>{current}</span>
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-border min-w-[12rem]">
          <DropdownMenuGroup>
            {props.options.map((o) => (
              <DropdownMenuItem
                key={o.value}
                onClick={() => props.onChange(o.value)}
              >
                {o.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TeamPage() {
  const [teamFilter, setTeamFilter] = useState<string>(ALL_TEAMS);
  const [sortMode, setSortMode] = useState<SortMode>("subteam");

  const allTeams = teamNames();

  const filtered = useMemo(() => {
    if (teamFilter === ALL_TEAMS) return members;
    return members.filter((m) =>
      m.teams.some((t) => slugify(t) === teamFilter),
    );
  }, [teamFilter]);

  const sorted = useMemo(() => {
    if (sortMode === "alphabetical") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortMode === "admins") {
      return [...filtered].sort((a, b) => {
        if (a.isAdmin !== b.isAdmin) return a.isAdmin ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }
    return filtered;
  }, [filtered, sortMode]);

  return (
    <GenericPage
      title="Our Team"
      headerContent={<p>The folks who make it all happen</p>}
    >
      <div className="z-10 bg-bg px-[4rem] pt-4 pb-[4rem] flex flex-col gap-4">
        <div className="flex flex-row flex-wrap items-end gap-4 border-b border-border pb-4">
          <FilterDropdown
            label="Subteam"
            value={teamFilter}
            onChange={setTeamFilter}
            options={[
              { value: ALL_TEAMS, label: "All subteams" },
              ...allTeams.map((t) => ({ value: slugify(t), label: t })),
            ]}
          />
          <FilterDropdown
            label="Sort"
            value={sortMode}
            onChange={(v) => setSortMode(v as SortMode)}
            options={(Object.keys(SORT_LABELS) as SortMode[]).map((s) => ({
              value: s,
              label: SORT_LABELS[s],
            }))}
          />
          <p className="text-sm text-foreground/60 ml-auto">
            {sorted.length} {sorted.length === 1 ? "member" : "members"}
          </p>
        </div>

        {sortMode === "subteam" ? (
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
