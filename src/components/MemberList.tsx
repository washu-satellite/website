import { TeamTile } from "@/routes/team";
import { Profile } from "@/services/auth.schema"
import { DisplayUserShort } from "@/services/user.schema";

export function MemberList(props: {
    members?: DisplayUserShort[]
}) {
    const current = props.members?.filter(m => m.membershipStatus === "Current member")??[];

    const alumni = props.members?.filter(m => m.membershipStatus === "Alum")??[];

    return (
        <div className="flex flex-col gap-2">
            <h2>Members</h2>
            <div className="flex flex-row flex-wrap justify-start gap-4">
                {current.length > 0 ? current.map(m => (
                    <TeamTile
                        key={m.id}
                        {...m}
                    />
                )) : (
                    <p className="text-foreground/80">There are currently no members in this team</p>
                )}
            </div>
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