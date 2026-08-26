import { prisma } from '@lumos/database';
import {
  Prisma,
  UploadIntentPurpose,
  UploadIntentStatus,
} from '@lumos/database/generated/prisma/client';
import type { UploadIntent } from '@lumos/database/generated/prisma/client';
import { AVATAR_MAX_SIZE_BYTES, AVATAR_UPLOAD_EXPIRES_IN_SECONDS } from '@lumos/validation/user';
import { ORPCError } from '@orpc/client';
import { ulid } from 'ulid';

import {
  getAvatarCleanupKeys,
  isLeaseStale,
  isTerminalAvatarUploadStatus,
  TERMINAL_AVATAR_UPLOAD_STATUSES,
} from './policy';
import { isValidAvatarObject } from './policy';
import {
  createAvatarUploadUrl,
  deleteAvatarObject,
  getAvatarPublicUrl,
  getAvatarPublishedKey,
  getAvatarStagingKey,
  getManagedAvatarKey,
  headAvatarObject,
  isObjectNotFound,
  publishAvatarObject,
} from './storage';

export type AvatarLog = {
  set: (fields: Record<string, unknown>) => void;
};

const ACTIVE_UPLOAD_SLOTS = [1, 2, 3] as const;
const MAX_UPLOADS_PER_HOUR = 12;
const PROCESSING_LEASE_MS = 60_000;
const CLEANUP_LEASE_MS = 60_000;
const INTENT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const MAINTENANCE_BATCH_SIZE = 25;

class AvatarConfirmationConflict extends Error {}
class AvatarIntentOwnershipLost extends Error {}

export async function createAvatarUploadIntent({
  userId,
  contentType,
  contentLength,
  log,
}: {
  userId: string;
  contentType: string;
  contentLength: number;
  log: AvatarLog;
}) {
  await maintainAvatarUploadIntents(userId, log);

  const recentUploads = await prisma.uploadIntent.count({
    where: {
      userId,
      purpose: UploadIntentPurpose.USER_AVATAR,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
    },
  });

  if (recentUploads >= MAX_UPLOADS_PER_HOUR) throwUploadRateLimit();

  const uploadId = ulid();
  const stagingKey = getAvatarStagingKey(userId, uploadId);
  const expiresAt = new Date(Date.now() + AVATAR_UPLOAD_EXPIRES_IN_SECONDS * 1000);

  log.set({
    eventId: uploadId,
    uploadId,
    avatarUploadStage: 'intent_created',
    avatarObjectKey: stagingKey,
  });

  // Signing is local. Persisting afterwards ensures a failed signing attempt
  // cannot consume one of the user's active intent slots.
  const signedUrl = await createAvatarUploadUrl(stagingKey);

  const reserved = await persistIntentInAvailableSlot({
    uploadId,
    userId,
    stagingKey,
    contentType,
    contentLength,
    expiresAt,
  });
  if (!reserved) throwUploadRateLimit();

  return { signedUrl, uploadId };
}

export async function confirmAvatarUpload({
  uploadId,
  userId,
  log,
}: {
  uploadId: string;
  userId: string;
  log: AvatarLog;
}) {
  let intent = await getOwnedAvatarIntent(uploadId, userId);

  log.set({
    eventId: intent.id,
    uploadId: intent.id,
    avatarObjectKey: intent.stagingKey,
    avatarUploadStage: 'confirmation_started',
  });

  if (intent.status === UploadIntentStatus.CONFIRMED && intent.publishedKey) {
    await safelyCleanupAvatarIntent(intent.id, log);
    return { image: getAvatarPublicUrl(intent.publishedKey) };
  }

  const claim = await claimAvatarIntent(intent, userId, log);
  if ('publishedKey' in claim) {
    await safelyCleanupAvatarIntent(intent.id, log);
    return { image: getAvatarPublicUrl(claim.publishedKey) };
  }

  intent = claim.intent;
  const publishedKey = getAvatarPublishedKey(userId, intent.id);

  let uploadedObject: Awaited<ReturnType<typeof headAvatarObject>>;
  try {
    uploadedObject = await headAvatarObject(intent.stagingKey);
  } catch (error) {
    if (isObjectNotFound(error)) {
      if (await rejectOwnedIntent(intent.id, claim.token, 'missing_object')) {
        await safelyCleanupAvatarIntent(intent.id, log);
      }
      throw new ORPCError('NOT_FOUND', {
        message: 'A imagem não foi encontrada no armazenamento. Tente novamente.',
      });
    }

    await resetOwnedIntent(intent.id, claim.token, 'head_failed');
    log.set({ avatarUploadStage: 'head_failed', avatarUploadError: 'storage_unavailable' });
    throw new ORPCError('INTERNAL_SERVER_ERROR', {
      message: 'Não foi possível verificar a imagem. Tente novamente.',
      cause: error,
    });
  }

  if (
    !isValidAvatarObject({
      contentLength: uploadedObject.ContentLength,
      contentType: uploadedObject.ContentType,
      expectedLength: intent.contentLength,
      maxSize: intent.maxSize,
    }) ||
    uploadedObject.ContentType !== intent.contentType ||
    !uploadedObject.ETag
  ) {
    if (await rejectOwnedIntent(intent.id, claim.token, 'object_constraints_failed')) {
      await safelyCleanupAvatarIntent(intent.id, log);
    }
    throw new ORPCError('BAD_REQUEST', {
      message: 'A imagem enviada não atende aos requisitos de formato ou tamanho.',
    });
  }

  await requireProcessingLease(intent.id, claim.token);

  try {
    await publishAvatarObject({
      sourceKey: intent.stagingKey,
      destinationKey: publishedKey,
      sourceEtag: uploadedObject.ETag,
    });
  } catch (error) {
    await compensateFailedPublication(intent.id, claim.token, publishedKey, 'publish_failed', log);
    log.set({ avatarUploadStage: 'publish_failed', avatarUploadError: 'storage_unavailable' });
    throw new ORPCError('INTERNAL_SERVER_ERROR', {
      message: 'Não foi possível publicar a imagem. Tente novamente.',
      cause: error,
    });
  }

  await requireProcessingLease(intent.id, claim.token);

  const fileUrl = getAvatarPublicUrl(publishedKey);
  try {
    await confirmAvatarInDatabase({
      intentId: intent.id,
      processingToken: claim.token,
      userId,
      publishedKey,
      fileUrl,
    });
  } catch (error) {
    const currentIntent = await prisma.uploadIntent.findUnique({ where: { id: intent.id } });

    // A database response can be lost after commit. The durable cleanup flag
    // makes this branch safe and lets an idempotent retry finish housekeeping.
    if (currentIntent?.status === UploadIntentStatus.CONFIRMED && currentIntent.publishedKey) {
      await safelyCleanupAvatarIntent(currentIntent.id, log);
      return { image: getAvatarPublicUrl(currentIntent.publishedKey) };
    }

    await compensateFailedPublication(
      intent.id,
      claim.token,
      publishedKey,
      error instanceof AvatarConfirmationConflict ? 'concurrent_update' : 'database_failed',
      log,
    );

    if (error instanceof AvatarConfirmationConflict) {
      throw new ORPCError('CONFLICT', {
        message: 'A foto de perfil foi alterada em outra solicitação. Tente novamente.',
      });
    }

    if (error instanceof AvatarIntentOwnershipLost) {
      throw new ORPCError('CONFLICT', {
        message: 'A confirmação desta imagem foi retomada por outra solicitação.',
      });
    }

    throw new ORPCError('INTERNAL_SERVER_ERROR', {
      message: 'Não foi possível salvar a foto de perfil. Tente novamente.',
      cause: error,
    });
  }

  await safelyCleanupAvatarIntent(intent.id, log);
  return { image: fileUrl };
}

export async function deleteAvatar({ userId, log }: { userId: string; log: AvatarLog }) {
  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { image: true },
  });

  if (!current?.image) return;

  const eventId = ulid();
  const managedKey = getManagedAvatarKey(current.image, userId);
  log.set({ eventId, avatarUploadStage: 'deletion_started', avatarObjectKey: managedKey });

  // OAuth-hosted images are references we do not own.
  if (managedKey) {
    try {
      await deleteAvatarObject(managedKey);
    } catch (error) {
      log.set({
        avatarUploadStage: 'deletion_failed',
        avatarUploadError: 'storage_unavailable',
      });
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Não foi possível excluir a foto de perfil. Tente novamente.',
        cause: error,
      });
    }
  }

  const cleared = await prisma.user.updateMany({
    where: { id: userId, image: current.image },
    data: { image: null },
  });

  if (cleared.count !== 1) {
    throw new ORPCError('CONFLICT', {
      message: 'A foto de perfil foi alterada em outra solicitação. Tente novamente.',
    });
  }
}

async function getOwnedAvatarIntent(uploadId: string, userId: string) {
  const intent = await prisma.uploadIntent.findUnique({ where: { id: uploadId } });

  // Do not reveal whether another user's upload intent exists.
  if (!intent || intent.userId !== userId || intent.purpose !== UploadIntentPurpose.USER_AVATAR) {
    throw new ORPCError('NOT_FOUND', { message: 'Upload não encontrado.' });
  }

  return intent;
}

async function claimAvatarIntent(
  intent: UploadIntent,
  userId: string,
  log: AvatarLog,
  attempt = 0,
): Promise<{ intent: UploadIntent; token: string } | { publishedKey: string }> {
  if (attempt >= 3) {
    throw new ORPCError('CONFLICT', {
      message: 'A confirmação desta imagem foi alterada por outra solicitação.',
    });
  }

  if (intent.status === UploadIntentStatus.PENDING) {
    const now = new Date();
    if (intent.expiresAt <= now) {
      const expired = await expirePendingIntent(intent.id, now);
      if (expired) {
        await safelyCleanupAvatarIntent(intent.id, log);
        throwExpiredUpload();
      }
    } else {
      const token = ulid();
      const claimed = await prisma.uploadIntent.updateMany({
        where: {
          id: intent.id,
          userId,
          purpose: UploadIntentPurpose.USER_AVATAR,
          status: UploadIntentStatus.PENDING,
          expiresAt: { gt: now },
        },
        data: {
          status: UploadIntentStatus.PROCESSING,
          processingToken: token,
          processingStartedAt: now,
          failureReason: null,
        },
      });

      if (claimed.count === 1) {
        return {
          intent: {
            ...intent,
            status: UploadIntentStatus.PROCESSING,
            processingToken: token,
            processingStartedAt: now,
            failureReason: null,
          },
          token,
        };
      }
    }
  } else if (intent.status === UploadIntentStatus.PROCESSING) {
    const now = new Date();
    if (!isLeaseStale(intent.processingStartedAt, now, PROCESSING_LEASE_MS)) {
      throw new ORPCError('CONFLICT', {
        message: 'A confirmação desta imagem já está em andamento.',
      });
    }

    const token = ulid();
    const reclaimed = await prisma.uploadIntent.updateMany({
      where: {
        id: intent.id,
        userId,
        purpose: UploadIntentPurpose.USER_AVATAR,
        status: UploadIntentStatus.PROCESSING,
        processingToken: intent.processingToken,
        processingStartedAt: intent.processingStartedAt,
      },
      data: {
        processingToken: token,
        processingStartedAt: now,
        failureReason: null,
      },
    });

    if (reclaimed.count === 1) {
      return {
        intent: {
          ...intent,
          processingToken: token,
          processingStartedAt: now,
          failureReason: null,
        },
        token,
      };
    }
  } else {
    if (intent.cleanupPending) await safelyCleanupAvatarIntent(intent.id, log);
    throw new ORPCError('BAD_REQUEST', {
      message: 'Esta intenção de upload não está mais disponível.',
    });
  }

  const currentIntent = await getOwnedAvatarIntent(intent.id, userId);
  if (currentIntent.status === UploadIntentStatus.CONFIRMED && currentIntent.publishedKey) {
    return { publishedKey: currentIntent.publishedKey };
  }

  return claimAvatarIntent(currentIntent, userId, log, attempt + 1);
}

async function renewProcessingLease(intentId: string, processingToken: string) {
  const renewed = await prisma.uploadIntent.updateMany({
    where: {
      id: intentId,
      status: UploadIntentStatus.PROCESSING,
      processingToken,
    },
    data: { processingStartedAt: new Date() },
  });

  if (renewed.count !== 1) throw new AvatarIntentOwnershipLost();
}

async function requireProcessingLease(intentId: string, processingToken: string) {
  try {
    await renewProcessingLease(intentId, processingToken);
  } catch (error) {
    if (!(error instanceof AvatarIntentOwnershipLost)) throw error;
    throw new ORPCError('CONFLICT', {
      message: 'A confirmação desta imagem foi retomada por outra solicitação.',
      cause: error,
    });
  }
}

async function confirmAvatarInDatabase({
  intentId,
  processingToken,
  userId,
  publishedKey,
  fileUrl,
}: {
  intentId: string;
  processingToken: string;
  userId: string;
  publishedKey: string;
  fileUrl: string;
}) {
  return prisma.$transaction(async (transaction) => {
    const current = await transaction.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    if (!current) throw new Error('User not found');

    const previousKey = getManagedAvatarKey(current.image, userId);
    const updated = await transaction.user.updateMany({
      where: { id: userId, image: current.image },
      data: { image: fileUrl },
    });

    if (updated.count !== 1) throw new AvatarConfirmationConflict();

    const confirmed = await transaction.uploadIntent.updateMany({
      where: {
        id: intentId,
        userId,
        purpose: UploadIntentPurpose.USER_AVATAR,
        status: UploadIntentStatus.PROCESSING,
        processingToken,
      },
      data: {
        status: UploadIntentStatus.CONFIRMED,
        activeSlot: null,
        processingToken: null,
        processingStartedAt: null,
        publishedKey,
        previousKey,
        confirmedAt: new Date(),
        failureReason: null,
        cleanupPending: true,
      },
    });

    if (confirmed.count !== 1) throw new AvatarIntentOwnershipLost();
    return previousKey;
  });
}

async function compensateFailedPublication(
  intentId: string,
  processingToken: string,
  publishedKey: string,
  reason: string,
  log: AvatarLog,
) {
  // Move to an immutable terminal state before deleting. Cleanup must never
  // act on a candidate that a reclaimed processing lease may now own.
  if (await rejectOwnedIntent(intentId, processingToken, reason)) {
    log.set({ avatarUploadStage: 'publication_compensation', avatarObjectKey: publishedKey });
    await safelyCleanupAvatarIntent(intentId, log);
  }
}

async function expirePendingIntent(intentId: string, now: Date) {
  const expired = await prisma.uploadIntent.updateMany({
    where: {
      id: intentId,
      status: UploadIntentStatus.PENDING,
      expiresAt: { lte: now },
    },
    data: terminalIntentData(UploadIntentStatus.EXPIRED, 'expired'),
  });
  return expired.count === 1;
}

async function rejectOwnedIntent(intentId: string, processingToken: string, reason: string) {
  const rejected = await prisma.uploadIntent.updateMany({
    where: {
      id: intentId,
      status: UploadIntentStatus.PROCESSING,
      processingToken,
    },
    data: terminalIntentData(UploadIntentStatus.REJECTED, reason),
  });
  return rejected.count === 1;
}

async function resetOwnedIntent(intentId: string, processingToken: string, reason: string) {
  const reset = await prisma.uploadIntent.updateMany({
    where: {
      id: intentId,
      status: UploadIntentStatus.PROCESSING,
      processingToken,
    },
    data: {
      status: UploadIntentStatus.PENDING,
      processingToken: null,
      processingStartedAt: null,
      failureReason: reason,
      cleanupPending: false,
    },
  });
  return reset.count === 1;
}

function terminalIntentData(status: UploadIntentStatus, failureReason: string) {
  return {
    status,
    activeSlot: null,
    processingToken: null,
    processingStartedAt: null,
    failureReason,
    cleanupPending: true,
  };
}

async function maintainAvatarUploadIntents(userId: string, log: AvatarLog) {
  const now = new Date();
  const staleProcessing = new Date(now.getTime() - PROCESSING_LEASE_MS);

  await prisma.uploadIntent.updateMany({
    where: {
      userId,
      purpose: UploadIntentPurpose.USER_AVATAR,
      status: UploadIntentStatus.PENDING,
      expiresAt: { lte: now },
    },
    data: terminalIntentData(UploadIntentStatus.EXPIRED, 'expired'),
  });

  await prisma.uploadIntent.updateMany({
    where: {
      userId,
      purpose: UploadIntentPurpose.USER_AVATAR,
      status: UploadIntentStatus.PROCESSING,
      expiresAt: { lte: now },
      OR: [{ processingStartedAt: null }, { processingStartedAt: { lte: staleProcessing } }],
    },
    data: terminalIntentData(UploadIntentStatus.EXPIRED, 'processing_lease_expired'),
  });

  const cleanupIntents = await prisma.uploadIntent.findMany({
    where: {
      userId,
      purpose: UploadIntentPurpose.USER_AVATAR,
      cleanupPending: true,
      status: { in: [...TERMINAL_AVATAR_UPLOAD_STATUSES] },
    },
    orderBy: { updatedAt: 'asc' },
    take: MAINTENANCE_BATCH_SIZE,
    select: { id: true },
  });

  await Promise.all(cleanupIntents.map(({ id }) => safelyCleanupAvatarIntent(id, log)));

  await prisma.uploadIntent.deleteMany({
    where: {
      userId,
      purpose: UploadIntentPurpose.USER_AVATAR,
      cleanupPending: false,
      status: { in: [...TERMINAL_AVATAR_UPLOAD_STATUSES] },
      updatedAt: { lt: new Date(now.getTime() - INTENT_RETENTION_MS) },
    },
  });
}

async function safelyCleanupAvatarIntent(intentId: string, log: AvatarLog) {
  try {
    await cleanupAvatarIntent(intentId, log);
  } catch (error) {
    log.set({
      avatarUploadStage: 'cleanup_failed',
      avatarUploadError: 'cleanup_unavailable',
      cleanupIntentId: intentId,
    });
    void error;
  }
}

async function cleanupAvatarIntent(intentId: string, log: AvatarLog) {
  const intent = await prisma.uploadIntent.findUnique({ where: { id: intentId } });
  if (!intent || !intent.cleanupPending || !isTerminalAvatarUploadStatus(intent.status)) return;

  const now = new Date();
  const staleCleanup = new Date(now.getTime() - CLEANUP_LEASE_MS);
  const cleanupToken = ulid();
  const claimed = await prisma.uploadIntent.updateMany({
    where: {
      id: intent.id,
      status: intent.status,
      cleanupPending: true,
      OR: [
        { cleanupToken: null },
        { cleanupStartedAt: null },
        { cleanupStartedAt: { lte: staleCleanup } },
      ],
    },
    data: { cleanupToken, cleanupStartedAt: now },
  });

  if (claimed.count !== 1) return;

  const keys = getAvatarCleanupKeys({
    status: intent.status,
    stagingKey: intent.stagingKey,
    previousKey: intent.previousKey,
    candidateKey: getAvatarPublishedKey(intent.userId, intent.id),
  });
  const results = await Promise.all(keys.map((key) => tryDeleteObject(key, log, 'object_cleanup')));
  const cleanupFailed = results.some((result) => !result);

  await prisma.uploadIntent.updateMany({
    where: { id: intent.id, status: intent.status, cleanupToken },
    data: {
      cleanupPending: cleanupFailed,
      cleanupToken: null,
      cleanupStartedAt: null,
    },
  });
}

async function tryDeleteObject(key: string, log: AvatarLog, stage: string) {
  try {
    await deleteAvatarObject(key);
    return true;
  } catch (error) {
    log.set({ avatarUploadStage: stage, cleanupKey: key, cleanupFailed: true });
    void error;
    return false;
  }
}

async function persistIntentInAvailableSlot({
  uploadId,
  userId,
  stagingKey,
  contentType,
  contentLength,
  expiresAt,
  slotIndex = 0,
}: {
  uploadId: string;
  userId: string;
  stagingKey: string;
  contentType: string;
  contentLength: number;
  expiresAt: Date;
  slotIndex?: number;
}): Promise<boolean> {
  const activeSlot = ACTIVE_UPLOAD_SLOTS[slotIndex];
  if (!activeSlot) return false;

  try {
    await prisma.uploadIntent.create({
      data: {
        id: uploadId,
        userId,
        purpose: UploadIntentPurpose.USER_AVATAR,
        status: UploadIntentStatus.PENDING,
        activeSlot,
        stagingKey,
        contentType,
        contentLength,
        maxSize: AVATAR_MAX_SIZE_BYTES,
        expiresAt,
      },
    });
    return true;
  } catch (error) {
    if (!(await isOccupiedActiveSlot(error, userId, activeSlot))) throw error;
    return persistIntentInAvailableSlot({
      uploadId,
      userId,
      stagingKey,
      contentType,
      contentLength,
      expiresAt,
      slotIndex: slotIndex + 1,
    });
  }
}

async function isOccupiedActiveSlot(error: unknown, userId: string, activeSlot: number) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
    return false;
  }

  const occupied = await prisma.uploadIntent.findFirst({
    where: {
      userId,
      purpose: UploadIntentPurpose.USER_AVATAR,
      activeSlot,
    },
    select: { id: true },
  });
  return Boolean(occupied);
}

function throwExpiredUpload(): never {
  throw new ORPCError('BAD_REQUEST', {
    message: 'O upload expirou. Selecione a imagem novamente.',
  });
}

function throwUploadRateLimit(): never {
  throw new ORPCError('TOO_MANY_REQUESTS', {
    message: 'Muitas tentativas de upload. Aguarde alguns minutos e tente novamente.',
  });
}
