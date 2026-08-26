import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@lumos/env/rpc';
import { AVATAR_CONTENT_TYPE, AVATAR_UPLOAD_EXPIRES_IN_SECONDS } from '@lumos/validation/user';

import { s3Client } from '../s3';

export const AVATAR_STAGING_PREFIX = 'avatar-staging';
export const AVATAR_PUBLISHED_PREFIX = 'avatars';

export function getAvatarStagingKey(userId: string, uploadId: string) {
  return `${AVATAR_STAGING_PREFIX}/${userId}/${uploadId}.webp`;
}

export function getAvatarPublishedKey(userId: string, uploadId: string) {
  return `${AVATAR_PUBLISHED_PREFIX}/${userId}/${uploadId}.webp`;
}

export function getAvatarPublicUrl(key: string) {
  const baseUrl = env.S3_PUBLIC_URL.replace(/\/+$/, '');
  const encodedKey = key
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  return `${baseUrl}/${encodedKey}`;
}

/**
 * Returns an object key only when the URL belongs to this user's managed avatar namespace.
 * External OAuth image URLs and malformed URLs are intentionally treated as unmanaged.
 */
export function getManagedAvatarKey(imageUrl: string | null | undefined, userId: string) {
  if (!imageUrl) return null;

  try {
    const image = new URL(imageUrl);
    const publicUrl = new URL(env.S3_PUBLIC_URL);
    if (image.origin !== publicUrl.origin) return null;

    const publicPath = publicUrl.pathname.replace(/\/+$/, '');
    const imagePath = decodeURIComponent(image.pathname);
    if (!imagePath.startsWith(`${publicPath}/`)) return null;

    const key = imagePath.slice(publicPath.length + 1);
    const legacyKey = `${AVATAR_PUBLISHED_PREFIX}/${userId}.webp`;
    const versionedPrefix = `${AVATAR_PUBLISHED_PREFIX}/${userId}/`;
    if (key === legacyKey) return key;

    const versionedKeyPattern = new RegExp(
      `^${escapeRegExp(versionedPrefix)}[0-9A-HJKMNP-TV-Z]{26}\\.webp$`,
    );
    return versionedKeyPattern.test(key) ? key : null;
  } catch {
    return null;
  }
}

export async function createAvatarUploadUrl(stagingKey: string) {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: stagingKey,
    ContentType: AVATAR_CONTENT_TYPE,
    // R2 supports conditional PutObject. This makes the bearer URL single-write.
    IfNoneMatch: '*',
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: AVATAR_UPLOAD_EXPIRES_IN_SECONDS,
    // The S3 presigner treats Content-Type as unsignable by default. R2's
    // browser upload must enforce it, so explicitly opt it into the signature.
    signableHeaders: new Set(['content-type', 'if-none-match']),
  });
}

export async function headAvatarObject(key: string) {
  return s3Client.send(
    new HeadObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
    }),
  );
}

export async function publishAvatarObject({
  sourceKey,
  destinationKey,
  sourceEtag,
}: {
  sourceKey: string;
  destinationKey: string;
  sourceEtag: string;
}) {
  const copySource = `${env.S3_BUCKET}/${sourceKey
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')}`;

  return s3Client.send(
    new CopyObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: destinationKey,
      CopySource: copySource,
      CopySourceIfMatch: sourceEtag,
      MetadataDirective: 'REPLACE',
      ContentType: AVATAR_CONTENT_TYPE,
      // Versioned keys prevent replacement races; a bounded TTL also limits
      // how long a deleted profile photo can remain in a custom-domain cache.
      CacheControl: 'public, max-age=300, must-revalidate',
    }),
  );
}

export async function deleteAvatarObject(key: string) {
  return s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
    }),
  );
}

export function isObjectNotFound(error: unknown) {
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

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
