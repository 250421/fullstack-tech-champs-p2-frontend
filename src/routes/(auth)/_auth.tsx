import { Navbar } from '@/components/shared/navbar';
import { AppSidebar } from '@/components/shared/sidebar/app-sidebar';
import { SidebarContainer } from '@/components/shared/sidebar/sidebar-container';
import { SidebarMainWrapper } from '@/components/shared/sidebar/sidebar-main-wrapper';
import { useAuth } from '@/features/auth/hook/useAuth'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/(auth)/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center h-screen justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (!data?.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarContainer>
      <AppSidebar />
      <SidebarMainWrapper>
        <Navbar />
        <main className="max-w-screen mx-auto w-11/12">
          <Outlet />
        </main>
      </SidebarMainWrapper>
    </SidebarContainer>
  );
}
