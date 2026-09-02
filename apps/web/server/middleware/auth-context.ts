import { auth } from '@lumos/auth';
import { withDatabaseRequestGuard } from '@lumos/database/request-deadline';
import { identifyOptions } from '@lumos/logging/options';
import {
  assertForegroundDeadline,
  findDependencyTimeout,
  requireRequestDeadline,
  withDeadlinePhase,
} from '@lumos/request-deadline';
import type { RequestLogger } from 'evlog';
import { createAuthMiddleware } from 'evlog/better-auth';
import { createError } from 'h3';
import { defineMiddleware } from 'nitro';

const identifyRequest = createAuthMiddleware(auth, {
  ...identifyOptions,
  exclude: ['/assets/**', '/_build/**'],
});

export default defineMiddleware(async (event) => {
  const log = event.context.log as RequestLogger | undefined;
  if (!log) return;

  const deadline = requireRequestDeadline(event.req);

  try {
    await withDeadlinePhase(deadline, 'foreground', () =>
      withDatabaseRequestGuard(
        () => assertForegroundDeadline(deadline, 'database_query'),
        async () => {
          assertForegroundDeadline(deadline, 'auth_context_before_session');
          await identifyRequest(log, event.req.headers, event.url.pathname);
          assertForegroundDeadline(deadline, 'auth_context_after_session');
        },
      ),
    );
  } catch (error) {
    const timeout = findDependencyTimeout(error);
    if (!timeout) throw error;

    throw createError({
      statusCode: 504,
      statusMessage: 'Um serviço necessário demorou demais para responder. Tente novamente.',
    });
  }
});
