import { RoleForm } from "@/routes/admin/new-role";
import { createRole, updateRole } from "@/services/team.api";
import { getFullProfile } from "@/services/user.api";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teamQueries } from "@/services/queries";

export const Route = createFileRoute("/missions/roles/edit/$role_slug")({
  loader: async ({ params, context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(teamQueries.getRole(params.role_slug)),
    ]);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const { redirect: redirectTo } = Route.useSearch();

  const queryClient = useQueryClient();

  const updateRoleMutation = useMutation({
    mutationKey: ["team", "update-role"],
    mutationFn: updateRole,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["team", "roles-by-project", "get"] });
      navigate({ to: redirectTo || "/team" });
    },
  });

  const params = Route.useParams();

  const role = useQuery(teamQueries.getRole(params.role_slug));

  return (
    <RoleForm
      title="Edit Role"
      defaults={role.data}
      onSubmit={async ({ value }) => {
        if (value.userId) {
          const profile = await getFullProfile({
            data: { username: value.userId },
          });

          value.userId = profile?.userId;
        }

        await updateRoleMutation.mutateAsync({ data: value });
      }}
    />
  );
}
