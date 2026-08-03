import type { User } from '@lumos/auth';
import { authClient } from '@lumos/auth/auth-client';
import {
  IconCommand,
  IconDeviceDesktop,
  IconLogout,
  IconMoon,
  IconPalette,
  IconSettings,
  IconSun,
} from '@tabler/icons-react';
import { formatForDisplay } from '@tanstack/react-hotkeys';
import { Link, redirect } from '@tanstack/react-router';

import { useCheatSheet } from '@/components/cheat-sheet/store';
import { useTheme } from '@/components/providers/theme-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { hotkeys } from '@/hotkeys';
import { useAuth } from '@/lib/auth/hooks';

export function SidebarNavUser() {
  const { isPending, isAuthenticated, user } = useAuth();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

  const { setOpen: setOpenCheatSheet } = useCheatSheet();

  async function handleSignOut() {
    await authClient.signOut();
    globalThis.location.reload();
  }

  if (isPending) return <Skeleton className="h-12 w-full rounded-md" />;
  if (!isAuthenticated) throw redirect({ to: '/sign-in' });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
            <UserView user={user} />
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align="center" sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserView user={user} />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <IconPalette /> Tema
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                      <DropdownMenuRadioItem value="system">
                        <IconDeviceDesktop /> Sistema
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="light">
                        <IconSun /> Claro
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark">
                        <IconMoon /> Escuro
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem render={<Link to="/settings/{-$tab}" />}>
                <IconSettings /> Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenCheatSheet(true)}>
                <IconCommand /> Atalhos
                <DropdownMenuShortcut>
                  {formatForDisplay(hotkeys.toggleCheatSheet.keys)}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                <IconLogout /> Sair
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserView({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-x-2 text-foreground">
      <Avatar className="size-8 rounded-sm">
        <AvatarImage src={user.image ?? undefined} alt={user.name} className="rounded-sm" />
        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="grid">
        <span className="truncate text-sm font-medium">{user.name}</span>
        <span className="truncate text-sm text-muted-foreground">{user.username}</span>
      </div>
    </div>
  );
}
