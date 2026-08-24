import { createFileRoute, Outlet } from '@tanstack/react-router';

import { getSidebarStateFn } from '@/components/sidebar';
import { AppShell } from '@/components/sidebar/app-shell';
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
    <AppShell defaultSidebarOpen={sidebarState}>
      <Outlet />
    </AppShell>
  );
}
