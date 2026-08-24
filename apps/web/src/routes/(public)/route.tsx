import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

import { Logo } from '@/components/logo';
import { getSidebarStateFn } from '@/components/sidebar';
import { AppShell } from '@/components/sidebar/app-shell';
import { AppInset } from '@/components/sidebar/inset';
import { Button } from '@/components/ui/button';
import { getIsAuthenticatedFn } from '@/lib/auth/functions';
import { AuthGuard } from '@/lib/auth/guard';
import { useAuth } from '@/lib/auth/hooks';

export const Route = createFileRoute('/(public)')({
  loader: async () => {
    const [isAuthenticated, sidebarState] = await Promise.all([
      getIsAuthenticatedFn(),
      getSidebarStateFn(),
    ]);

    return { isAuthenticated, sidebarState };
  },
  component: PublicLayout,
});

function PublicLayout() {
  const { isAuthenticated: loaderIsAuthenticated, sidebarState } = Route.useLoaderData();
  const { isAuthenticated, isPending } = useAuth();
  const showAppLayout = isPending ? loaderIsAuthenticated : isAuthenticated;

  if (showAppLayout)
    return (
      <AppShell defaultSidebarOpen={sidebarState}>
        <AppInset
          breadcrumbs={[{ label: 'Campanhas', href: '/campaigns' }]}
          contentClassName="[&>[data-slot=campaign-content]]:mx-0 [&>[data-slot=campaign-content]]:max-w-none [&>[data-slot=campaign-content]]:p-0 sm:[&>[data-slot=campaign-content]]:p-0 lg:[&>[data-slot=campaign-content]]:p-0"
        >
          <Outlet />
        </AppInset>
      </AppShell>
    );

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/campaigns" aria-label="Nossa Causa — campanhas">
            <Logo className="text-lg" />
          </Link>

          <nav className="flex items-center gap-2" aria-label="Navegação principal">
            <AuthGuard when="authenticated">
              <Button nativeButton={false} variant="ghost" render={<Link to="/campaigns/my" />}>
                Minhas campanhas
              </Button>
              <Button nativeButton={false} render={<Link to="/campaigns/new" />}>
                Criar campanha
              </Button>
            </AuthGuard>
            <AuthGuard when="unauthenticated">
              <Button nativeButton={false} variant="ghost" render={<Link to="/sign-in" />}>
                Entrar
              </Button>
              <Button nativeButton={false} render={<Link to="/sign-up" />}>
                Criar conta
              </Button>
            </AuthGuard>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
