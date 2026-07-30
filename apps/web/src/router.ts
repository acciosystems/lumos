import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';

import { ErrorBoundary } from '@/components/boundaries/error';
import { NotFoundBoundary } from '@/components/boundaries/not-found';

import { routeTree } from './routeTree.gen';

export interface RouterContext {
  queryClient: QueryClient;
}

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient } satisfies RouterContext,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultErrorComponent: ErrorBoundary,
    defaultNotFoundComponent: NotFoundBoundary,
  });

  return router;
}
