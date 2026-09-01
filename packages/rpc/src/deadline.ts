import { AsyncLocalStorage } from 'node:async_hooks';

import { prisma } from '@lumos/database';
import type { Prisma } from '@lumos/database/generated/prisma/client';
import { withDatabaseRequestGuard } from '@lumos/database/request-deadline';

export const FUNCTION_MAX_DURATION_SECONDS = 60;
export const REQUEST_WORK_BUDGET_MS = 40_000;
export const REQUEST_COMPENSATION_DEADLINE_MS = 55_000;
// A transaction may wait three seconds for a connection, then run for ten. Stop starting
// non-abortable database compensation at 42 seconds so it can finish by the 55-second deadline.
export const REQUEST_COMPENSATION_DATABASE_START_CUTOFF_MS = 42_000;
export const STORAGE_OPERATION_TIMEOUT_MS = 5_000;

export class DependencyTimeoutError extends Error {
  public readonly dependency: string;
  public readonly stage: string;
  public readonly durationMs: number;

  public constructor({
    dependency,
    stage,
    durationMs,
    cause,
  }: {
    dependency: string;
    stage: string;
    durationMs: number;
    cause?: unknown;
  }) {
    super(`${dependency} timed out during ${stage}.`, cause === undefined ? undefined : { cause });
    this.name = 'DependencyTimeoutError';
    this.dependency = dependency;
    this.stage = stage;
    this.durationMs = durationMs;
  }
}

export type RequestDeadline = {
  startedAt: number;
  foregroundSignal: AbortSignal;
  compensationSignal: AbortSignal;
  compensationDatabaseSignal: AbortSignal;
};

type DeadlinePhase = 'foreground' | 'compensation';

type ActiveDeadline = {
  deadline: RequestDeadline;
  phase: DeadlinePhase;
};

const activeDeadline = new AsyncLocalStorage<ActiveDeadline>();

export function createRequestDeadline(requestSignal?: AbortSignal): RequestDeadline {
  const startedAt = Date.now();
  const workBudget = AbortSignal.timeout(REQUEST_WORK_BUDGET_MS);

  return {
    startedAt,
    foregroundSignal: requestSignal ? AbortSignal.any([requestSignal, workBudget]) : workBudget,
    // Compensation must still run after a client disconnect. Its own cap leaves
    // five seconds before Vercel's hard limit for serialization and logging.
    compensationSignal: AbortSignal.timeout(REQUEST_COMPENSATION_DEADLINE_MS),
    compensationDatabaseSignal: AbortSignal.timeout(REQUEST_COMPENSATION_DATABASE_START_CUTOFF_MS),
  };
}

export function assertForegroundDeadline(deadline: RequestDeadline, stage: string): void {
  if (!deadline.foregroundSignal.aborted) return;

  throw new DependencyTimeoutError({
    dependency: 'request',
    stage,
    durationMs: Date.now() - deadline.startedAt,
  });
}

export function assertCompensationDeadline(deadline: RequestDeadline, stage: string): void {
  if (!deadline.compensationSignal.aborted) return;

  throw new DependencyTimeoutError({
    dependency: 'request',
    stage: `compensation_${stage}`,
    durationMs: Date.now() - deadline.startedAt,
  });
}

function assertCompensationDatabaseDeadline(deadline: RequestDeadline): void {
  if (!deadline.compensationDatabaseSignal.aborted) return;

  throw new DependencyTimeoutError({
    dependency: 'request',
    stage: 'compensation_database_query',
    durationMs: Date.now() - deadline.startedAt,
  });
}

export function withForegroundDeadline<T>(deadline: RequestDeadline, callback: () => T): T {
  return activeDeadline.run({ deadline, phase: 'foreground' }, () =>
    withDatabaseRequestGuard(() => assertForegroundDeadline(deadline, 'database_query'), callback),
  );
}

export function withCompensationDeadline<T>(deadline: RequestDeadline, callback: () => T): T {
  return activeDeadline.run({ deadline, phase: 'compensation' }, () =>
    withDatabaseRequestGuard(() => assertCompensationDatabaseDeadline(deadline), callback),
  );
}

/** Runs cleanup against the current request's compensation budget, when one exists. */
export function withActiveCompensationDeadline<T>(callback: () => T): T {
  const current = activeDeadline.getStore();
  return current ? withCompensationDeadline(current.deadline, callback) : callback();
}

export function assertActiveDeadline(stage: string): void {
  const current = activeDeadline.getStore();
  if (!current) return;

  if (current.phase === 'foreground') {
    assertForegroundDeadline(current.deadline, stage);
  } else {
    assertCompensationDeadline(current.deadline, stage);
  }
}

export function getActiveDeadlineSignal(): AbortSignal | undefined {
  const current = activeDeadline.getStore();
  if (!current) return undefined;
  return current.phase === 'foreground'
    ? current.deadline.foregroundSignal
    : current.deadline.compensationSignal;
}

/** Starts an interactive transaction only while the active request phase still has budget. */
export function runDatabaseTransaction<T>(
  callback: (transaction: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  assertActiveDeadline('database_transaction');
  return prisma.$transaction(callback);
}

export function combineOperationSignal(signal: AbortSignal | undefined, timeoutMs: number) {
  const operationTimeout = AbortSignal.timeout(timeoutMs);
  return signal ? AbortSignal.any([signal, operationTimeout]) : operationTimeout;
}

export function findDependencyTimeout(error: unknown): DependencyTimeoutError | undefined {
  let current = error;

  for (let depth = 0; depth < 4 && current; depth += 1) {
    if (current instanceof DependencyTimeoutError) return current;
    current = current instanceof Error ? current.cause : undefined;
  }

  return undefined;
}
