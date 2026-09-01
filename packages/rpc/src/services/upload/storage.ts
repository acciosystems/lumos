import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@lumos/env/rpc';

import {
  assertActiveDeadline,
  combineOperationSignal,
  DependencyTimeoutError,
  getActiveDeadlineSignal,
  STORAGE_OPERATION_TIMEOUT_MS,
} from '../../deadline';
import { s3Client } from '../s3';

export function getPublicObjectUrl(key: string) {
  const baseUrl = env.S3_PUBLIC_URL.replace(/\/+$/, '');
  return `${baseUrl}/${encodeObjectKey(key)}`;
}

export async function createSingleWriteUploadUrl({
  key,
  contentType,
  expiresIn,
}: {
  key: string;
  contentType: string;
  expiresIn: number;
}) {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    IfNoneMatch: '*',
  });
  return getSignedUrl(s3Client, command, {
    expiresIn,
    signableHeaders: new Set(['content-type', 'if-none-match']),
  });
}

export async function headUploadObject(key: string, signal?: AbortSignal) {
  return sendStorageCommand(
    'head',
    (abortSignal) =>
      s3Client.send(new HeadObjectCommand({ Bucket: env.S3_BUCKET, Key: key }), { abortSignal }),
    signal,
  );
}

export async function publishUploadObject(
  {
    sourceKey,
    destinationKey,
    sourceEtag,
    contentType,
    cacheControl,
    contentDisposition,
  }: {
    sourceKey: string;
    destinationKey: string;
    sourceEtag: string;
    contentType: string;
    cacheControl: string;
    contentDisposition?: string;
  },
  signal?: AbortSignal,
) {
  return sendStorageCommand(
    'copy',
    (abortSignal) =>
      s3Client.send(
        new CopyObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: destinationKey,
          CopySource: `${env.S3_BUCKET}/${encodeObjectKey(sourceKey)}`,
          CopySourceIfMatch: sourceEtag,
          MetadataDirective: 'REPLACE',
          ContentType: contentType,
          CacheControl: cacheControl,
          ContentDisposition: contentDisposition,
        }),
        { abortSignal },
      ),
    signal,
  );
}

export async function deleteUploadObject(key: string, signal?: AbortSignal) {
  await sendStorageCommand(
    'delete',
    (abortSignal) =>
      s3Client.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: key }), { abortSignal }),
    signal,
  );
}

export function isUploadObjectNotFound(error: unknown) {
  if (typeof error !== 'object' || error === null) return false;
  const candidate = error as {
    name?: unknown;
    code?: unknown;
    $metadata?: { httpStatusCode?: unknown };
  };
  return (
    candidate.$metadata?.httpStatusCode === 404 ||
    candidate.name === 'NotFound' ||
    candidate.name === 'NoSuchKey' ||
    candidate.code === 'NotFound' ||
    candidate.code === 'NoSuchKey'
  );
}

function encodeObjectKey(key: string) {
  return key
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

async function sendStorageCommand<T>(
  stage: string,
  send: (signal: AbortSignal) => Promise<T>,
  signal?: AbortSignal,
) {
  const startedAt = Date.now();
  const requestSignal = signal ?? getActiveDeadlineSignal();
  assertActiveDeadline(`r2_${stage}`);
  const operationSignal = combineOperationSignal(requestSignal, STORAGE_OPERATION_TIMEOUT_MS);

  try {
    return await send(operationSignal);
  } catch (error) {
    if (requestSignal?.aborted) {
      assertActiveDeadline(`r2_${stage}`);
    }
    if (!operationSignal.aborted && !isTimeoutError(error)) throw error;

    throw new DependencyTimeoutError({
      dependency: 'r2',
      stage,
      durationMs: Date.now() - startedAt,
      cause: error,
    });
  }
}

function isTimeoutError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === 'TimeoutError' || error.name === 'AbortError' || /timeout/i.test(error.message))
  );
}
