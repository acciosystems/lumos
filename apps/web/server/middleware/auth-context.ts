import { auth } from '@lumos/auth';
import { identifyOptions } from '@lumos/logging/options';
import type { RequestLogger } from 'evlog';
import { createAuthMiddleware } from 'evlog/better-auth';
import { defineMiddleware } from 'nitro';

const identifyRequest = createAuthMiddleware(auth, {
  ...identifyOptions,
  exclude: ['/assets/**', '/_build/**'],
});

export default defineMiddleware(async (event) => {
  const log = event.context.log as RequestLogger | undefined;
  if (!log) return;

  await identifyRequest(log, event.req.headers, event.url.pathname);
});
