import { createEnv } from '@t3-oss/env-core';
import * as v from 'valibot';

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_SIGNUP_ENABLED: v.pipe(v.string(), v.parseBoolean()),
  },

  runtimeEnv: { ...process.env, ...import.meta.env },
  emptyStringAsUndefined: true,
});
