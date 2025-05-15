import { createRootRoute, Outlet } from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

export const Route = createRootRoute({
  component: () => <RootLayout/>
    
});

const RootLayout = () =>{
  const queryClient = new QueryClient()
  return(
    <>
    <QueryClientProvider client={queryClient}>
      <Outlet/>
    </QueryClientProvider>
    </>
  )
}