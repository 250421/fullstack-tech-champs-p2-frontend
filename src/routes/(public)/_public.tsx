import { useAuth } from '@/features/auth/hook/useAuth';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { Loader } from 'lucide-react';

export const Route = createFileRoute('/(public)/_public')({
  component: PublicLayout,
})

export function PublicLayout() {
  const { data, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center h-screen justify-center">
        <Loader className="size-4 animate-spin"  data-testid="loader" />
      </div>
    );
  }

  if (data?.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div data-testid="public-layout">
      <Outlet />
    </div>
  );
}

