import { createFileRoute, Outlet } from '@tanstack/react-router';

import { CheatSheet } from '@/components/cheat-sheet';
import { AppSidebar, getSidebarStateFn } from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ensureAuthFn } from '@/lib/auth/functions';

export const Route = createFileRoute('/(app)')({
  beforeLoad: async () => await ensureAuthFn(),
  loader: async () => {
    const sidebarState = await getSidebarStateFn();
    return { sidebarState };
  },
  component: AppLayout,
});

function AppLayout() {
  const { sidebarState } = Route.useLoaderData();

  return (
    <SidebarProvider defaultOpen={sidebarState}>
      <AppSidebar />
      <Outlet />
      <CheatSheet />
    </SidebarProvider>
  );
}
