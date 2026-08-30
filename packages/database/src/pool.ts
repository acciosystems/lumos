import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, type PoolConfig } from 'pg';

/**
 * Keep the per-isolate pool deliberately small. A serverless isolate can be
 * multiplied many times, so pg's default pool size of 10 is needlessly spicy.
 */
export const SERVERLESS_POOL_OPTIONS = {
  max: 1,
  min: 0,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 10_000,
  maxLifetimeSeconds: 300,
  allowExitOnIdle: true,
  keepAlive: true,
  statement_timeout: 10_000,
  query_timeout: 12_000,
  lock_timeout: 3_000,
  idle_in_transaction_session_timeout: 5_000,
  application_name: 'lumos-web',
} satisfies PoolConfig;

export const SERVERLESS_TRANSACTION_OPTIONS = {
  maxWait: 3_000,
  timeout: 10_000,
} as const;

export function createServerlessPool(connectionString: string) {
  return new Pool({ connectionString, ...SERVERLESS_POOL_OPTIONS });
}

export function createServerlessAdapter(pool: Pool) {
  return new PrismaPg(pool, { disposeExternalPool: true });
}
