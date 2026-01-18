import { ProjectForm } from '@/routes/admin/new-project';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, updateProject } from '@/services/team.api';
import { teamQueries } from '@/services/queries';

export const Route = createFileRoute('/missions/edit/$project_slug')({
  loader: async ({ params, context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(teamQueries.getProject(params.project_slug)),
    ]);
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
    
  const { redirect: redirectTo } = Route.useSearch();

  const queryClient = useQueryClient();

  const updateProjectMutation = useMutation({
    mutationKey: ["team", "update-project"],
    mutationFn: updateProject,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      navigate({ to: redirectTo || "/team" });
    },
  });

  const params = Route.useParams();
  
  const project = useQuery(teamQueries.getProject(params.project_slug));

  return (
    <ProjectForm
      title="Edit Subteam"
      defaults={project.data}
      onSubmit={async ({ value }) => {
        await updateProjectMutation.mutateAsync({ data: value });
      }}
    />
  );
}
