import { QueryClientProvider } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';

import { Route } from '@/routes/__root';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { queryClient } = useRouteContext({ from: Route.id });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
