import { classifyDatabaseError } from '@lumos/database/telemetry';
import { ORPCError } from '@orpc/client';

import { base } from '../base';
import { findDependencyTimeout } from '../deadline';

export const dependencyTimeoutMiddleware = base.middleware(async ({ context, next }) => {
  try {
    return await next();
  } catch (error) {
    const dependencyTimeout = findDependencyTimeout(error);
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
