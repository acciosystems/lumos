import { createEnv } from '@t3-oss/env-core';

import { databaseUrlSchema } from './database-url';

/** Environment required only by Prisma migrations and other administrative commands. */
export const env = createEnv({
  server: {
    DIRECT_DATABASE_URL: databaseUrlSchema('direct'),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
