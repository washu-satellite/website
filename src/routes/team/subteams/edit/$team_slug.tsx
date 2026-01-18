import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTeam, updateTeam } from '@/services/team.api';
import { TeamForm } from '@/routes/admin/new-team';
import { teamQueries } from '@/services/queries';


export const Route = createFileRoute('/team/subteams/edit/$team_slug')({
  loader: async ({ params, context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(teamQueries.get(params.team_slug)),
    ]);
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  
  const { redirect: redirectTo } = Route.useSearch();

  const queryClient = useQueryClient();

  const updateTeamMutation = useMutation({
    mutationKey: ["team", "update"],
    mutationFn: updateTeam,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      navigate({ to: redirectTo || "/team" });
    },
  });

  const params = Route.useParams();

  const team = useQuery(teamQueries.get(params.team_slug));
  
  return (
    <TeamForm
      title="Edit Subteam"
      defaults={team.data}
      onSubmit={async ({ value }) => {
        await updateTeamMutation.mutateAsync({ data: value });
      }}
    />
  );
}
