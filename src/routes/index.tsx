import { useAuth } from '@/features/auth/hook/useAuth';
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const {data: user} = useAuth();
  if (!user){
    return <Navigate to = {"/login"}/>;
  }
  return (
    <div className="p-2">
      <h3>Welcome Home</h3>
    </div>
  )
}