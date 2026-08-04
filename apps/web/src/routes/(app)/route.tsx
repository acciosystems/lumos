import { useHotkey } from '@tanstack/react-hotkeys';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

import { useCheatSheet } from '@/components/cheat-sheet/store';
import { AppSidebar, getSidebarStateFn } from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { hotkeys } from '@/hotkeys';
import { ensureAuthFn } from '@/lib/auth/functions';

const CheatSheet = lazy(() =>
  import('@/components/cheat-sheet').then(({ CheatSheet: Component }) => ({ default: Component })),
);

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
  const { isOpen, setOpen } = useCheatSheet();

  useHotkey(hotkeys.toggleCheatSheet.keys, () => setOpen(!isOpen));

  return (
    <SidebarProvider defaultOpen={sidebarState}>
      <AppSidebar />
      <Outlet />
      {isOpen && (
        <Suspense fallback={null}>
          <CheatSheet />
        </Suspense>
      )}
    </SidebarProvider>
  );
}
