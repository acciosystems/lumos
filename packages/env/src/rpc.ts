import { createEnv } from '@t3-oss/env-core';
import * as v from 'valibot';

export const env = createEnv({
  server: {
    S3_ENDPOINT: v.pipe(v.string(), v.url()),
    S3_REGION: v.string(),
    S3_ACCESS_KEY: v.string(),
    S3_SECRET_KEY: v.string(),
    S3_BUCKET: v.string(),
    S3_PUBLIC_URL: v.pipe(v.string(), v.url()),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
