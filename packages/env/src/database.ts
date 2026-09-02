import { createEnv } from '@t3-oss/env-core';

import { databaseUrlSchema } from './database-url';

export const env = createEnv({
  server: {
    DATABASE_URL: databaseUrlSchema('pooled'),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
