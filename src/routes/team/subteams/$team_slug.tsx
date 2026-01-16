import GenericPage from '@/components/GenericPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/team/subteams/$team_slug')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams();
  
  return (
    <GenericPage
      title={`${params.team_slug} Subteam`}
    >
      <h2>Leadership</h2>
      <h2>Members</h2>
    </GenericPage>
  )
}
