import { useHotkey } from '@tanstack/react-hotkeys';
import { lazy, Suspense } from 'react';

import { useCheatSheet } from '@/components/cheat-sheet/store';
import { SidebarProvider } from '@/components/ui/sidebar';
import { hotkeys } from '@/hotkeys';

import { AppSidebar } from '.';

const CheatSheet = lazy(() =>
  import('@/components/cheat-sheet').then(({ CheatSheet: Component }) => ({ default: Component })),
);

export function AppShell({
  children,
  defaultSidebarOpen,
}: {
  children: React.ReactNode;
  defaultSidebarOpen: boolean;
}) {
  const { isOpen, setOpen } = useCheatSheet();

  useHotkey(hotkeys.toggleCheatSheet.keys, () => setOpen(!isOpen));

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <AppSidebar />
      {children}
      {isOpen && (
        <Suspense fallback={null}>
          <CheatSheet />
        </Suspense>
      )}
    </SidebarProvider>
  );
}
