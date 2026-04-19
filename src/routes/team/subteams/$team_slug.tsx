import GenericPage from "@/components/GenericPage";
import { createFileRoute } from "@tanstack/react-router";
import { MemberList } from "@/components/MemberList";
import { membersByTeam } from "@/const/content/members";

export const Route = createFileRoute("/team/subteams/$team_slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const teamMembers = membersByTeam(params.team_slug);
  const teamName = teamMembers[0]?.team ?? params.team_slug;

  return (
    <GenericPage title={`${teamName} Subteam`}>
      <MemberList members={teamMembers} />
    </GenericPage>
  );
}
