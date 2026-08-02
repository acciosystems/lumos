import {
  IconHeartHandshake,
  IconHomeFilled,
  IconLayoutListFilled,
  IconPlus,
} from '@tabler/icons-react';
import { Link, useLocation } from '@tanstack/react-router';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const mainItems = [{ title: 'Início', href: '/', icon: IconHomeFilled }];

const campaignItems = [
  { title: 'Campanhas', href: '/campaigns', icon: IconHeartHandshake },
  { title: 'Minhas campanhas', href: '/campaigns/my', icon: IconLayoutListFilled },
  { title: 'Criar campanha', href: '/campaigns/new', icon: IconPlus },
];

export function SidebarNavMain() {
  const pathname = useLocation({ select: (loc) => loc.pathname });
  const { setOpenMobile } = useSidebar();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Principal</SidebarGroupLabel>
        <SidebarMenu>
          {mainItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => setOpenMobile(false)}
                isActive={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
                render={<Link to={item.href} />}
              >
                <item.icon className="size-4" /> {item.title}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Campanhas</SidebarGroupLabel>
        <SidebarMenu>
          {campaignItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => setOpenMobile(false)}
                isActive={
                  item.href === '/campaigns'
                    ? pathname === item.href
                    : pathname.startsWith(item.href)
                }
                render={<Link to={item.href} />}
              >
                <item.icon className="size-4" /> {item.title}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
