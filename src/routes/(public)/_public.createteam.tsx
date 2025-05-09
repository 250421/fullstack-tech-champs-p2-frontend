import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/_public/createteam')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/_public/createteam"!</div>
}
