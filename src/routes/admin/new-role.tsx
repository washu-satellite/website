import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/new-role')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/new-role"!</div>
}
