import { UploadIntentStatus } from '@lumos/database/generated/prisma/client';
import { AVATAR_CONTENT_TYPE, AVATAR_MAX_SIZE_BYTES } from '@lumos/validation/user';

export { isLeaseStale } from '../upload/policy';

export const TERMINAL_AVATAR_UPLOAD_STATUSES = [
  UploadIntentStatus.CONFIRMED,
  UploadIntentStatus.REJECTED,
  UploadIntentStatus.EXPIRED,
] as const;

export function isTerminalAvatarUploadStatus(status: UploadIntentStatus) {
  return (TERMINAL_AVATAR_UPLOAD_STATUSES as readonly UploadIntentStatus[]).includes(status);
}

export function getAvatarCleanupKeys({
  status,
  stagingKey,
  previousKey,
  candidateKey,
}: {
  status: UploadIntentStatus;
  stagingKey: string;
  previousKey: string | null;
  candidateKey: string;
}) {
  const keys = [
    stagingKey,
    previousKey,
    status === UploadIntentStatus.CONFIRMED ? null : candidateKey,
  ].filter((key): key is string => Boolean(key));
  return [...new Set(keys)];
}

export function isValidAvatarObject({
  contentLength,
  contentType,
  expectedLength,
  maxSize,
}: {
  contentLength: number | undefined;
  contentType: string | undefined;
  expectedLength: number;
  maxSize: number;
}) {
  return (
    contentType === AVATAR_CONTENT_TYPE &&
    typeof contentLength === 'number' &&
    contentLength > 0 &&
    contentLength === expectedLength &&
    contentLength <= maxSize &&
    maxSize <= AVATAR_MAX_SIZE_BYTES
  );
}
