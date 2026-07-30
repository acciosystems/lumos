import { auth } from '@lumos/auth';
import { identifyOptions } from '@lumos/logging/options';
import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start';
import type { RequestLogger } from 'evlog';
import { createAuthMiddleware } from 'evlog/better-auth';
import { useRequest } from 'nitro/context';

import { authMiddleware } from '@/lib/auth/functions';

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

const easterEggMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  result.response.headers.set('X-Powered-By', 'Etanol Cachaca Pinga Reactor 4');
  return result;
});

const identify = createAuthMiddleware(auth, identifyOptions);

const loggingMiddleware = createMiddleware().server(async ({ next }) => {
  const req = useRequest();
  const log = req.context?.log as RequestLogger;
  await identify(log, req.headers);
  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, easterEggMiddleware, loggingMiddleware],
  functionMiddleware: [authMiddleware],
}));
