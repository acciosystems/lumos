import { classifyDatabaseError } from '@lumos/database/telemetry';
import { ORPCError } from '@orpc/client';

import { base } from '../base';
import {
  assertForegroundDeadline,
  findDependencyTimeout,
  withForegroundDeadline,
} from '../deadline';

export const dependencyTimeoutMiddleware = base.middleware(async ({ context, next }) => {
  try {
    return await withForegroundDeadline(context.deadline, async () => {
      assertForegroundDeadline(context.deadline, 'rpc_before_handler');
      const result = await next();
      assertForegroundDeadline(context.deadline, 'rpc_after_handler');
      return result;
    });
  } catch (error) {
    let dependencyTimeout = findDependencyTimeout(error);
    if (!dependencyTimeout && context.deadline.foregroundSignal.aborted) {
      try {
        assertForegroundDeadline(context.deadline, 'rpc_after_handler');
      } catch (deadlineError) {
        dependencyTimeout = findDependencyTimeout(deadlineError);
      }
    }
    const databaseTimeout = dependencyTimeout ? undefined : classifyDatabaseError(error);
    if (!dependencyTimeout && !databaseTimeout) throw error;

    context.log?.set({
      dependency: dependencyTimeout?.dependency ?? 'database',
      timeoutStage: dependencyTimeout?.stage ?? `database_${databaseTimeout}`,
      dependencyDurationMs: dependencyTimeout?.durationMs,
    });

    throw new ORPCError('GATEWAY_TIMEOUT', {
      message: 'Um serviço necessário demorou demais para responder. Tente novamente.',
      cause: error,
    });
  }
});
