import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { evlogErrorHandler } from 'evlog/nitro/v3';

import type { RouterContext } from '@/router';

import styles from '@/styles/main.css?url';

export const Route = createRootRouteWithContext<RouterContext>()({
  server: {
    middleware: [createMiddleware().server(evlogErrorHandler)],
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Nossa Causa' },
    ],
    links: [{ rel: 'stylesheet', href: styles }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body className="antialised">
        <Outlet />
      </body>
    </html>
  );
}
