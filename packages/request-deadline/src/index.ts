import { AsyncLocalStorage } from 'node:async_hooks';

export const FUNCTION_MAX_DURATION_SECONDS = 60;
export const REQUEST_WORK_BUDGET_MS = 40_000;
export const REQUEST_COMPENSATION_DEADLINE_MS = 55_000;
export const REQUEST_COMPENSATION_DATABASE_START_CUTOFF_MS = 42_000;

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

export type DeadlinePhase = 'foreground' | 'compensation';

type ActiveDeadline = {
  deadline: RequestDeadline;
  phase: DeadlinePhase;
};

const ACTIVE_DEADLINE_STORAGE_KEY = Symbol.for('lumos:request-deadline-storage');
const REQUEST_DEADLINES_KEY = Symbol.for('lumos:request-deadlines');

const globalForDeadline = globalThis as typeof globalThis & {
  [ACTIVE_DEADLINE_STORAGE_KEY]?: AsyncLocalStorage<ActiveDeadline>;
  [REQUEST_DEADLINES_KEY]?: WeakMap<Request, RequestDeadline>;
};

const activeDeadline =
  globalForDeadline[ACTIVE_DEADLINE_STORAGE_KEY] ?? new AsyncLocalStorage<ActiveDeadline>();

globalForDeadline[ACTIVE_DEADLINE_STORAGE_KEY] = activeDeadline;

const requestDeadlines =
  globalForDeadline[REQUEST_DEADLINES_KEY] ?? new WeakMap<Request, RequestDeadline>();

globalForDeadline[REQUEST_DEADLINES_KEY] = requestDeadlines;

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

/** Creates one deadline per HTTP request, including work before TanStack Start takes over. */
export function createRequestDeadlineForRequest(request: Request): RequestDeadline {
  const existingDeadline = requestDeadlines.get(request);
  if (existingDeadline) return existingDeadline;

  const deadline = createRequestDeadline(request.signal);
  requestDeadlines.set(request, deadline);
  return deadline;
}

export function requireRequestDeadline(request: Request): RequestDeadline {
  const deadline = requestDeadlines.get(request);
  if (!deadline) throw new Error('No request deadline was created for this request.');
  return deadline;
}

export function withDeadlinePhase<T>(
  deadline: RequestDeadline,
  phase: DeadlinePhase,
  callback: () => T,
): T {
  return activeDeadline.run({ deadline, phase }, callback);
}

export function getActiveDeadline(): ActiveDeadline | undefined {
  return activeDeadline.getStore();
}

export function getActiveRequestDeadline(): RequestDeadline | undefined {
  return getActiveDeadline()?.deadline;
}

export function requireActiveRequestDeadline(): RequestDeadline {
  const deadline = getActiveRequestDeadline();
  if (!deadline) throw new Error('No request deadline is active.');
  return deadline;
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

export function assertActiveDeadline(stage: string): void {
  const current = getActiveDeadline();
  if (!current) return;

  if (current.phase === 'foreground') {
    assertForegroundDeadline(current.deadline, stage);
  } else {
    assertCompensationDeadline(current.deadline, stage);
  }
}

export function getActiveDeadlineSignal(): AbortSignal | undefined {
  const current = getActiveDeadline();
  if (!current) return undefined;
  return current.phase === 'foreground'
    ? current.deadline.foregroundSignal
    : current.deadline.compensationSignal;
}

/** Observability uses this signal so client disconnects do not cancel final delivery. */
export function getActiveCompensationSignal(): AbortSignal | undefined {
  return getActiveRequestDeadline()?.compensationSignal;
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
