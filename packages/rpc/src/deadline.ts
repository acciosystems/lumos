export const FUNCTION_MAX_DURATION_SECONDS = 60;
export const REQUEST_WORK_BUDGET_MS = 40_000;
export const REQUEST_COMPENSATION_DEADLINE_MS = 55_000;
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
};

export function createRequestDeadline(requestSignal?: AbortSignal): RequestDeadline {
  const startedAt = Date.now();
  const workBudget = AbortSignal.timeout(REQUEST_WORK_BUDGET_MS);

  return {
    startedAt,
    foregroundSignal: requestSignal ? AbortSignal.any([requestSignal, workBudget]) : workBudget,
    // Compensation must still run after a client disconnect. Its own cap leaves
    // five seconds before Vercel's hard limit for serialization and logging.
    compensationSignal: AbortSignal.timeout(REQUEST_COMPENSATION_DEADLINE_MS),
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
