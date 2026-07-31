import { IconHeartFilled } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function SidebarNavHeader() {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" onClick={() => setOpenMobile(false)} render={<Link to="/" />}>
          <div className="flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <IconHeartFilled />
          </div>
          <div className="grid">
            <span className="truncate font-semibold">Nossa Causa</span>
            <span className="truncate text-xs text-muted-foreground">Codename LUMOS</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
