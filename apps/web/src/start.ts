import { withDatabaseRequestGuard } from '@lumos/database/request-deadline';
import {
  assertForegroundDeadline,
  findDependencyTimeout,
  requireRequestDeadline,
  withDeadlinePhase,
} from '@lumos/request-deadline';
import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start';

const requestDeadlineMiddleware = createMiddleware().server(async ({ next, request }) => {
  const deadline = requireRequestDeadline(request);

  try {
    return await withDeadlinePhase(deadline, 'foreground', () =>
      withDatabaseRequestGuard(
        () => assertForegroundDeadline(deadline, 'database_query'),
        async () => {
          assertForegroundDeadline(deadline, 'request_before_handler');
          const result = await next();
          assertForegroundDeadline(deadline, 'request_after_handler');
          return result;
        },
      ),
    );
  } catch (error) {
    let timeout = findDependencyTimeout(error);
    if (!timeout && deadline.foregroundSignal.aborted) {
      try {
        assertForegroundDeadline(deadline, 'request_after_handler');
      } catch (deadlineError) {
        timeout = findDependencyTimeout(deadlineError);
      }
    }

    if (!timeout) throw error;

    return new Response('Um serviço necessário demorou demais para responder. Tente novamente.', {
      status: 504,
    });
  }
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (context) => context.handlerType === 'serverFn',
});

export const startInstance = createStart(() => ({
  requestMiddleware: [requestDeadlineMiddleware, csrfMiddleware],
}));
