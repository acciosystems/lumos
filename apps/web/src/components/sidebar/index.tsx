import { useHotkey } from '@tanstack/react-hotkeys';
import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { hotkeys } from '@/hotkeys';

import { SidebarNavHeader } from './nav-header';
import { SidebarNavMain } from './nav-main';
import { SidebarNavUser } from './nav-user';

export const getSidebarStateFn = createServerFn().handler(() => {
  const state = getCookie('sidebar_state') ?? 'true';
  return state === 'true';
});

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();

  useHotkey(hotkeys.toggleSidebar.keys, toggleSidebar);

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="md:pt-0">
        <SidebarNavHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavMain />
      </SidebarContent>
      <SidebarFooter className="md:pb-0">
        <SidebarNavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
