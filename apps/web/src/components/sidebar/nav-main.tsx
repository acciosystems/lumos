import { IconHomeFilled } from '@tabler/icons-react';
import { Link, useLocation } from '@tanstack/react-router';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const mainItems = [{ title: 'Início', href: '/', icon: IconHomeFilled }];

export function SidebarNavMain() {
  const pathname = useLocation({ select: (loc) => loc.pathname });
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Principal</SidebarGroupLabel>
      <SidebarGroupContent>
        {mainItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              onClick={() => setOpenMobile(false)}
              isActive={pathname.startsWith(item.href)}
              render={<Link to={item.href} />}
            >
              <item.icon className="size-4" /> {item.title}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
