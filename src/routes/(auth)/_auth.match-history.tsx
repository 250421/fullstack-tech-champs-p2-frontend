import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_auth/match-history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/_auth/match-history"!</div>
}
