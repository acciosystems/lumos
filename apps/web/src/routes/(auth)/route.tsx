import { createFileRoute, Outlet } from '@tanstack/react-router';

import { ensureNotAuthFn } from '@/lib/auth/functions';

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async () => ensureNotAuthFn(),
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Outlet />
    </div>
  );
}
