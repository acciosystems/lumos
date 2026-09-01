import { createEnv } from '@t3-oss/env-core';
import * as v from 'valibot';

function isPostgresUrl(value: string) {
  const protocol = new URL(value).protocol;
  return protocol === 'postgres:' || protocol === 'postgresql:';
}

function isDirectNeonUrl(value: string) {
  const hostname = new URL(value).hostname;
  return !hostname.endsWith('.neon.tech') || !hostname.includes('-pooler.');
}

/** Environment required only by Prisma migrations and other administrative commands. */
export const env = createEnv({
  server: {
    DIRECT_DATABASE_URL: v.pipe(
      v.string(),
      v.url(),
      v.check(isPostgresUrl, 'Expected a PostgreSQL connection URL.'),
      v.check(isDirectNeonUrl, "Expected Neon's direct connection URL."),
    ),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
