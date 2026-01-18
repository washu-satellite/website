import GenericPage from '@/components/GenericPage'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { teamQueries } from '@/services/queries';
import { TeamTile } from '..';
import { useAuthenticatedUser } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { MemberList } from '@/components/MemberList';
import { deleteTeam } from '@/services/team.api';
import { DeleteButton } from '@/components/Form';

export const Route = createFileRoute('/team/subteams/$team_slug')({
  loader: async ({ params, context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(teamQueries.get(params.team_slug)),
      context.queryClient.ensureQueryData(teamQueries.getMembers(params.team_slug))
    ]);
  },
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams();
  
  const team = useSuspenseQuery(teamQueries.get(params.team_slug));

  const members = useSuspenseQuery(teamQueries.getMembers(params.team_slug));

  const userData = useAuthenticatedUser();

  const navigate = useNavigate();
    
  const { redirect: redirectTo } = Route.useSearch();

  const queryClient = useQueryClient();

  const deleteTeamMutation = useMutation({
    mutationKey: ["team", "delete"],
    mutationFn: deleteTeam,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      navigate({ to: redirectTo || "/team" });
    },
  });

  return (
    <GenericPage
      title={`${params.team_slug} Subteam`}
      headerContent={(
        <div className="w-full flex flex-col gap-4">
          <p>
            {team.data?.description}
          </p>
          {userData?.user.role === "admin" &&
            <div className="w-full flex flex-row items-center gap-2">
              <Link to="/team/subteams/edit/$team_slug" params={{ team_slug: team.data.name }}>
                <Button variant='outline'>
                  <Pencil />
                  Edit
                </Button>
              </Link>
              <DeleteButton
                onClick={() => deleteTeamMutation.mutateAsync({ data: { name: team.data.name } })}
              />
            </div>
          }
        </div>
      )}
    >
      <MemberList
        members={members.data}
      />
    </GenericPage>
  );
}
