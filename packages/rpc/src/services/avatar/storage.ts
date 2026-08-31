import { env } from '@lumos/env/rpc';
import { AVATAR_CONTENT_TYPE, AVATAR_UPLOAD_EXPIRES_IN_SECONDS } from '@lumos/validation/user';

import {
  createSingleWriteUploadUrl,
  deleteUploadObject,
  getPublicObjectUrl,
  headUploadObject,
  isUploadObjectNotFound,
  publishUploadObject,
} from '../upload/storage';

export const AVATAR_STAGING_PREFIX = 'avatar-staging';
export const AVATAR_PUBLISHED_PREFIX = 'avatars';

export function getAvatarStagingKey(userId: string, uploadId: string) {
  return `${AVATAR_STAGING_PREFIX}/${userId}/${uploadId}.webp`;
}

export function getAvatarPublishedKey(userId: string, uploadId: string) {
  return `${AVATAR_PUBLISHED_PREFIX}/${userId}/${uploadId}.webp`;
}

export function getAvatarPublicUrl(key: string) {
  return getPublicObjectUrl(key);
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
  return createSingleWriteUploadUrl({
    key: stagingKey,
    contentType: AVATAR_CONTENT_TYPE,
    expiresIn: AVATAR_UPLOAD_EXPIRES_IN_SECONDS,
  });
}

export async function headAvatarObject(key: string, signal?: AbortSignal) {
  return headUploadObject(key, signal);
}

export async function publishAvatarObject(
  {
    sourceKey,
    destinationKey,
    sourceEtag,
  }: {
    sourceKey: string;
    destinationKey: string;
    sourceEtag: string;
  },
  signal?: AbortSignal,
) {
  return publishUploadObject(
    {
      sourceKey,
      destinationKey,
      sourceEtag,
      contentType: AVATAR_CONTENT_TYPE,
      // Versioned keys prevent replacement races; a bounded TTL also limits
      // how long a deleted profile photo can remain in a custom-domain cache.
      cacheControl: 'public, max-age=300, must-revalidate',
    },
    signal,
  );
}

export async function deleteAvatarObject(key: string, signal?: AbortSignal) {
  return deleteUploadObject(key, signal);
}

export const isObjectNotFound = isUploadObjectNotFound;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
