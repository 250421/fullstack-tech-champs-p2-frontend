import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_auth/leaderboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/_auth/leaderboard"!</div>
}
