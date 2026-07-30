import { createEnv } from '@t3-oss/env-core';
import * as v from 'valibot';

export const env = createEnv({
  server: {
    AXIOM_DATASET: v.string(),
    AXIOM_TOKEN: v.string(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
