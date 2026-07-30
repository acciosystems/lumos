import { createFileRoute, Outlet } from '@tanstack/react-router';

import { ensureAuthFn } from '@/lib/auth/functions';

export const Route = createFileRoute('/(app)')({
  beforeLoad: async () => await ensureAuthFn(),
  component: AppLayout,
});

function AppLayout() {
  return <Outlet />;
}
