import { S3Client } from '@aws-sdk/client-s3';
import { env } from '@lumos/env/rpc';

export const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  maxAttempts: 1,
  requestHandler: {
    connectionTimeout: 2_000,
    requestTimeout: 5_000,
    throwOnRequestTimeout: true,
  },
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});
