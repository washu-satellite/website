import { TeamTile } from "@/routes/team";
import { DisplayUserShort } from "@/services/user.schema";

const UNASSIGNED_KEY = "__unassigned__";
const UNASSIGNED_LABEL = "Unassigned";

function formatDiscipline(name: string) {
    return name
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

function groupByDiscipline(members: DisplayUserShort[]) {
    const groups = new Map<string, DisplayUserShort[]>();

    for (const m of members) {
        const key = m.teamId ?? UNASSIGNED_KEY;
        const existing = groups.get(key);
        if (existing) {
            existing.push(m);
        } else {
            groups.set(key, [m]);
        }
    }

    return Array.from(groups.entries()).sort(([a], [b]) => {
        if (a === UNASSIGNED_KEY) return 1;
        if (b === UNASSIGNED_KEY) return -1;
        return a.localeCompare(b);
    });
}

export function MemberList(props: {
    members?: DisplayUserShort[]
}) {
    const current = props.members?.filter(m => m.membershipStatus === "Current member")??[];

    const alumni = props.members?.filter(m => m.membershipStatus === "Alum")??[];

    const currentByDiscipline = groupByDiscipline(current);

    return (
        <div className="flex flex-col gap-2">
            <h2>Members</h2>
            {current.length > 0 ? (
                <div className="flex flex-col gap-6">
                    {currentByDiscipline.map(([key, group]) => (
                        <div key={key} className="flex flex-col gap-2">
                            <h3 className="font-sans font-medium text-foreground/80">
                                {key === UNASSIGNED_KEY ? UNASSIGNED_LABEL : formatDiscipline(key)}
                            </h3>
                            <div className="flex flex-row flex-wrap justify-start gap-4">
                                {group.map(m => (
                                    <TeamTile
                                        key={m.id}
                                        {...m}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-foreground/80">There are currently no members in this team</p>
            )}
            {alumni.length > 0 &&
                <>
                    <h2 className="mt-4">Alumni</h2>
                    <div className="flex flex-row flex-wrap justify-start gap-4">
                        {alumni.map(m => (
                            <TeamTile
                                key={m.id}
                                {...m}
                            />
                        ))}
                    </div>
                </>
            }
        </div>
    )
}
