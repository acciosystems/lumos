import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/lib/auth/guard';

export const Route = createFileRoute('/(public)')({
  component: PublicLayout,
});

function PublicLayout() {
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
      <Outlet />
    </div>
  );
}
