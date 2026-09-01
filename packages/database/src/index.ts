import { env } from '@lumos/env/database';

import { PrismaClient } from './generated/prisma/client';
import {
  SERVERLESS_TRANSACTION_OPTIONS,
  createServerlessAdapter,
  createServerlessPool,
} from './pool';
import { assertDatabaseRequestAllowed } from './request-deadline';
import { attachPoolTelemetry, classifyDatabaseError, emitTimeoutTelemetry } from './telemetry';

const createDatabase = () => {
  const pool = createServerlessPool(env.DATABASE_URL);
  attachPoolTelemetry(pool);

  const adapter = createServerlessAdapter(pool);
  const client = new PrismaClient({
    adapter,
    log: [{ emit: 'event', level: 'error' }],
    transactionOptions: SERVERLESS_TRANSACTION_OPTIONS,
  });

  client.$on('error', (event) => {
    const timeoutKind = classifyDatabaseError({ message: event.message });
    if (!timeoutKind) return;

    emitTimeoutTelemetry(pool, {
      operation: 'query',
      outcome: 'error',
      timeoutKind,
    });
  });

  const deadlineAwareClient = client.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          assertDatabaseRequestAllowed();
          return query(args);
        },
      },
      async $queryRaw({ args, query }) {
        assertDatabaseRequestAllowed();
        return query(args);
      },
      async $executeRaw({ args, query }) {
        assertDatabaseRequestAllowed();
        return query(args);
      },
    },
  });

  // The extension only adds a pre-dispatch guard; retaining PrismaClient's public type keeps
  // transaction callback types stable for callers.
  return { client: deadlineAwareClient as typeof client, pool };
};

type DatabaseResources = ReturnType<typeof createDatabase>;

const globalForPrisma = globalThis as typeof globalThis & {
  lumosDatabase?: DatabaseResources;
};

const database = globalForPrisma.lumosDatabase ?? createDatabase();
globalForPrisma.lumosDatabase = database;

export const prisma = database.client;
