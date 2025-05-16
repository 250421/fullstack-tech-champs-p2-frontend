import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/__public/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/__public/test"!</div>
}
