import { createEnv } from '@t3-oss/env-core';
import * as v from 'valibot';

export const env = createEnv({
  server: {
    AXIOM_DATASET: v.string(),
    AXIOM_TOKEN: v.string(),
    AXIOM_URL: v.optional(v.pipe(v.string(), v.url())),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
