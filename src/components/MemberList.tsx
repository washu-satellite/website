import { TeamTile } from "@/routes/team";
import { primaryTeam, type Member } from "@/const/content/members";

function groupByTeam(members: Member[]) {
  const groups = new Map<string, Member[]>();

  for (const m of members) {
    const key = primaryTeam(m);
    const existing = groups.get(key);
    if (existing) existing.push(m);
    else groups.set(key, [m]);
  }

  // Always show Exec first if present, then alphabetical.
  return Array.from(groups.entries()).sort(([a], [b]) => {
    if (a === "Exec") return -1;
    if (b === "Exec") return 1;
    return a.localeCompare(b);
  });
}

export function MemberList(props: { members?: Member[] }) {
  const list = props.members ?? [];
  const grouped = groupByTeam(list);

  return (
    <div className="flex flex-col gap-2">
      <h2>Members</h2>
      {list.length > 0 ? (
        <div className="flex flex-col gap-6">
          {grouped.map(([team, group]) => (
            <div key={team} className="flex flex-col gap-2">
              <h3 className="font-sans font-medium text-foreground/80">
                {team}
              </h3>
              <div className="flex flex-row flex-wrap justify-start gap-4">
                {group.map((m) => (
                  <TeamTile key={m.name} {...m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-foreground/80">
          There are currently no members in this team
        </p>
      )}
    </div>
  );
}
