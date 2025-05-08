import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_auth/create-team')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/_auth/create-team"!</div>
}
