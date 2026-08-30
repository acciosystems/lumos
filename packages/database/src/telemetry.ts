import { scheduleAxiomDelivery } from '@lumos/logging/delivery';
import { createLogger } from 'evlog';
import type { Pool } from 'pg';

export type DatabaseTimeoutKind = 'acquisition' | 'statement' | 'lock' | 'transaction';

type PoolSnapshot = {
  max: number;
  total: number;
  idle: number;
  waiting: number;
  saturated: boolean;
};

type PoolMetric = {
  event: 'saturation' | 'error';
  errorCode?: string;
  pool: PoolSnapshot;
};

type QueryMetric = {
  operation: string;
  outcome: 'error';
  timeoutKind: DatabaseTimeoutKind;
  pool: PoolSnapshot;
};

function includesAny(message: string, fragments: readonly string[]) {
  return fragments.some((fragment) => message.includes(fragment));
}

export function getPoolSnapshot(pool: Pool): PoolSnapshot {
  const max = pool.options.max;
  const total = pool.totalCount;
  const idle = pool.idleCount;
  const waiting = pool.waitingCount;

  return {
    max,
    total,
    idle,
    waiting,
    saturated: total >= max && idle === 0 && waiting > 0,
  };
}

export function classifyDatabaseError(error: unknown): DatabaseTimeoutKind | undefined {
  if (!error || typeof error !== 'object') return undefined;

  const candidate = error as { code?: unknown; message?: unknown };
  const code = typeof candidate.code === 'string' ? candidate.code : undefined;
  const message = typeof candidate.message === 'string' ? candidate.message.toLowerCase() : '';

  if (
    code === 'P2024' ||
    includesAny(message, [
      'acquir',
      'pool timeout',
      'timeout exceeded when trying to connect',
      'connection timeout',
    ])
  ) {
    return 'acquisition';
  }

  if (
    code === 'P2028' ||
    includesAny(message, [
      'transaction timeout',
      'expired transaction',
      'timeout for this transaction',
      'unable to start a transaction in the given time',
    ])
  ) {
    return 'transaction';
  }
  if (code === '55P03' || message.includes('lock timeout')) return 'lock';
  if (
    code === '57014' ||
    includesAny(message, ['statement timeout', 'query timeout', 'query read timeout'])
  ) {
    return 'statement';
  }

  return undefined;
}

function emitMetric(payload: PoolMetric | QueryMetric) {
  // Observability must never turn a successful database operation into a failed request.
  try {
    scheduleAxiomDelivery(createLogger({ service: 'lumos/database', database: payload }).emit());
  } catch {
    // The request and pool remain authoritative if the logger is unavailable.
  }
}

export function attachPoolTelemetry(pool: Pool) {
  // pg emits release before handing the client to the next waiter. That makes
  // this the useful moment to report real contention without logging every query.
  pool.on('release', () => {
    const snapshot = getPoolSnapshot(pool);
    if (snapshot.saturated) emitMetric({ event: 'saturation', pool: snapshot });
  });
  pool.on('error', (error) =>
    emitMetric({
      event: 'error',
      errorCode: error instanceof Error && 'code' in error ? String(error.code) : undefined,
      pool: getPoolSnapshot(pool),
    }),
  );
}

export function emitTimeoutTelemetry(pool: Pool, metric: Omit<QueryMetric, 'pool'>) {
  const snapshot = getPoolSnapshot(pool);

  // pg removes a timed-out waiter before reporting the error. Preserve the
  // contention signal while the pool is still fully occupied.
  if (
    metric.timeoutKind === 'acquisition' &&
    snapshot.total >= snapshot.max &&
    snapshot.idle === 0
  ) {
    snapshot.saturated = true;
    emitMetric({ event: 'saturation', pool: snapshot });
  }

  emitMetric({ ...metric, pool: snapshot });
}
