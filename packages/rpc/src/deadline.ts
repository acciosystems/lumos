import { prisma } from '@lumos/database';
import type { Prisma } from '@lumos/database/generated/prisma/client';
import { withDatabaseRequestGuard } from '@lumos/database/request-deadline';
import {
  assertActiveDeadline,
  assertCompensationDeadline,
  assertForegroundDeadline,
  combineOperationSignal,
  createRequestDeadline,
  DependencyTimeoutError,
  findDependencyTimeout,
  FUNCTION_MAX_DURATION_SECONDS,
  getActiveDeadline,
  getActiveDeadlineSignal,
  REQUEST_COMPENSATION_DATABASE_START_CUTOFF_MS,
  REQUEST_COMPENSATION_DEADLINE_MS,
  REQUEST_WORK_BUDGET_MS,
  type RequestDeadline,
  withDeadlinePhase,
} from '@lumos/request-deadline';

// A transaction may wait three seconds for a connection, then run for ten. Stop starting
// non-abortable database compensation at 42 seconds so it can finish by the 55-second deadline.
export const STORAGE_OPERATION_TIMEOUT_MS = 5_000;

function assertCompensationDatabaseDeadline(deadline: RequestDeadline): void {
  if (!deadline.compensationDatabaseSignal.aborted) return;

  throw new DependencyTimeoutError({
    dependency: 'request',
    stage: 'compensation_database_query',
    durationMs: Date.now() - deadline.startedAt,
  });
}

export function withForegroundDeadline<T>(deadline: RequestDeadline, callback: () => T): T {
  return withDeadlinePhase(deadline, 'foreground', () =>
    withDatabaseRequestGuard(() => assertForegroundDeadline(deadline, 'database_query'), callback),
  );
}

export function withCompensationDeadline<T>(deadline: RequestDeadline, callback: () => T): T {
  return withDeadlinePhase(deadline, 'compensation', () =>
    withDatabaseRequestGuard(() => assertCompensationDatabaseDeadline(deadline), callback),
  );
}

/** Runs cleanup against the current request's compensation budget, when one exists. */
export function withActiveCompensationDeadline<T>(callback: () => T): T {
  const current = getActiveDeadline();
  return current ? withCompensationDeadline(current.deadline, callback) : callback();
}

/** Starts an interactive transaction only while the active request phase still has budget. */
export function runDatabaseTransaction<T>(
  callback: (transaction: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  assertActiveDeadline('database_transaction');
  return prisma.$transaction(callback);
}

export {
  assertActiveDeadline,
  assertCompensationDeadline,
  assertForegroundDeadline,
  combineOperationSignal,
  createRequestDeadline,
  DependencyTimeoutError,
  findDependencyTimeout,
  FUNCTION_MAX_DURATION_SECONDS,
  getActiveDeadlineSignal,
  REQUEST_COMPENSATION_DATABASE_START_CUTOFF_MS,
  REQUEST_COMPENSATION_DEADLINE_MS,
  REQUEST_WORK_BUDGET_MS,
};
export type { RequestDeadline };
