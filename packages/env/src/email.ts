import { createEnv } from '@t3-oss/env-core';
import * as v from 'valibot';

export const env = createEnv({
  server: {
    EMAIL_HOST: v.pipe(v.string(), v.domain()),
    EMAIL_PORT: v.pipe(v.string(), v.toNumber()),
    EMAIL_USER: v.string(),
    EMAIL_PASSWORD: v.string(),
    EMAIL_FROM: v.string(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
