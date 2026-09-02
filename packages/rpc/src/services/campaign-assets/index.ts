import { prisma } from '@lumos/database';
import {
  CampaignAssetKind,
  Prisma,
  UploadIntentPurpose,
  UploadIntentStatus,
} from '@lumos/database/generated/prisma/client';
import type { UploadIntent } from '@lumos/database/generated/prisma/client';
import {
  CAMPAIGN_ASSET_UPLOAD_EXPIRES_IN_SECONDS,
  CAMPAIGN_EVIDENCE_MAX_COUNT,
  CAMPAIGN_EVIDENCE_MAX_SIZE_BYTES,
  CAMPAIGN_IMAGE_MAX_SIZE_BYTES,
  type CampaignAssetUploadInput,
} from '@lumos/validation/campaign';
import { ORPCError } from '@orpc/client';
import { ulid } from 'ulid';

import {
  combineOperationSignal,
  getActiveDeadlineSignal,
  type RequestDeadline,
  runDatabaseTransaction,
  withActiveCompensationDeadline,
  withCompensationDeadline,
} from '../../deadline';
import { reconcileCampaignLifecycle } from '../campaign-lifecycle';
import { isLeaseStale } from '../upload/policy';
import { prepareInParallel } from './parallel-publication';
import { isOwnedCampaignAssetIntent, isValidCampaignAssetObject } from './policy';
import {
  createCampaignAssetUploadUrl,
  deleteCampaignAssetObject,
  getAssetPublicUrl,
  getCampaignAssetPublishedKey,
  getCampaignAssetStagingKey,
  headCampaignAssetObject,
  isCampaignAssetObjectNotFound,
  publishCampaignAssetObject,
} from './storage';

export type AssetLog = { set: (fields: Record<string, unknown>) => void };
export type CampaignAssetKindValue = 'IMAGE' | 'ACCOUNTABILITY_EVIDENCE';

export type PreparedCampaignAsset = {
  intent: UploadIntent;
  kind: CampaignAssetKindValue;
  publishedKey: string;
  processingToken: string | null;
  existing: boolean;
};

const CAMPAIGN_ASSET_PURPOSES = [
  UploadIntentPurpose.CAMPAIGN_IMAGE,
  UploadIntentPurpose.ACCOUNTABILITY_EVIDENCE,
] as const;
const ACTIVE_UPLOAD_SLOTS = Array.from(
  { length: CAMPAIGN_EVIDENCE_MAX_COUNT },
  (_, index) => index + 1,
);
const MAX_UPLOADS_PER_HOUR = 40;
const PROCESSING_LEASE_MS = 60_000;
const INTENT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const REMOVED_ASSET_CLEANUP_BATCH_SIZE = 5;
const REMOVED_ASSET_CLEANUP_CONCURRENCY = 2;
const REMOVED_ASSET_CLEANUP_BUDGET_MS = 8_000;

class CampaignAssetIntentOwnershipLost extends Error {}

export async function createCampaignAssetUploadIntent({
  input,
  userId,
  log,
}: {
  input: CampaignAssetUploadInput;
  userId: string;
  log: AssetLog;
}) {
  await maintainCampaignAssetUploads(userId, log);

  if (input.kind === 'IMAGE') {
    const organizer = await prisma.organizerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!organizer) {
      throw new ORPCError('FORBIDDEN', {
        message: 'Configure um perfil organizador antes de enviar uma imagem de campanha.',
      });
    }
  } else {
    const campaign = await runDatabaseTransaction(async (transaction) => {
      await transaction.$queryRaw(
        Prisma.sql`SELECT "id" FROM "campaigns" WHERE "id" = ${input.campaignId} FOR UPDATE`,
      );
      await reconcileCampaignLifecycle(transaction, input.campaignId);
      return transaction.campaign.findFirst({
        where: { id: input.campaignId, organizerProfile: { userId } },
        select: { status: true },
      });
    });
    if (!campaign) throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
    if (campaign.status !== 'COMPLETED') {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Evidências só podem ser enviadas para campanhas concluídas.',
      });
    }
  }

  const purpose = purposeFor(input.kind);
  const recentUploads = await prisma.uploadIntent.count({
    where: {
      userId,
      purpose,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
    },
  });
  if (recentUploads >= MAX_UPLOADS_PER_HOUR) throwUploadRateLimit();

  const uploadId = ulid();
  const stagingKey = getCampaignAssetStagingKey(userId, uploadId, input.contentType);
  const expiresAt = new Date(Date.now() + CAMPAIGN_ASSET_UPLOAD_EXPIRES_IN_SECONDS * 1000);
  const signedUrl = await createCampaignAssetUploadUrl(stagingKey, input.contentType);
  const reserved = await persistIntentInAvailableSlot({
    uploadId,
    userId,
    purpose,
    stagingKey,
    originalFileName: input.originalFileName,
    targetCampaignId: input.kind === 'ACCOUNTABILITY_EVIDENCE' ? input.campaignId : null,
    contentType: input.contentType,
    contentLength: input.contentLength,
    maxSize:
      input.kind === 'IMAGE' ? CAMPAIGN_IMAGE_MAX_SIZE_BYTES : CAMPAIGN_EVIDENCE_MAX_SIZE_BYTES,
    expiresAt,
  });
  if (!reserved) throwUploadRateLimit();

  log.set({ eventId: uploadId, assetUploadId: uploadId, assetUploadStage: 'intent_created' });
  return { signedUrl, uploadId, expiresAt };
}

export async function verifyCampaignAssetUpload({
  uploadId,
  userId,
  log,
}: {
  uploadId: string;
  userId: string;
  log: AssetLog;
}) {
  const intent = await getOwnedCampaignAssetIntent(uploadId, userId);
  if (intent.status !== UploadIntentStatus.PENDING) {
    throw new ORPCError('BAD_REQUEST', {
      message: 'Este upload não está disponível para verificação.',
    });
  }
  if (intent.expiresAt <= new Date()) {
    await expirePendingIntent(intent.id);
    await safelyCleanupUploadIntent(intent.id, log);
    throwExpiredUpload();
  }

  const object = await requireValidUploadedObject(intent, kindFor(intent.purpose), log);
  return {
    uploadId: intent.id,
    contentLength: object.ContentLength,
    contentType: object.ContentType,
  };
}

export async function discardCampaignAssetUpload({
  uploadId,
  userId,
  log,
}: {
  uploadId: string;
  userId: string;
  log: AssetLog;
}) {
  const intent = await getOwnedCampaignAssetIntent(uploadId, userId);
  const discarded = await prisma.uploadIntent.updateMany({
    where: { id: intent.id, userId, status: UploadIntentStatus.PENDING },
    data: terminalIntentData(UploadIntentStatus.REJECTED, 'discarded'),
  });
  if (!discarded.count) {
    throw new ORPCError('CONFLICT', { message: 'Este upload já está sendo processado.' });
  }
  await safelyCleanupUploadIntent(intent.id, log);
}

export async function prepareCampaignAssetUploads({
  uploadIds,
  userId,
  campaignId,
  kind,
  log,
  deadline,
}: {
  uploadIds: string[];
  userId: string;
  campaignId: string;
  kind: CampaignAssetKindValue;
  log: AssetLog;
  deadline: RequestDeadline;
}) {
  if (new Set(uploadIds).size !== uploadIds.length) {
    throw new ORPCError('BAD_REQUEST', { message: 'Um upload foi informado mais de uma vez.' });
  }

  return prepareInParallel<string, PreparedCampaignAsset>({
    items: uploadIds,
    prepare: async (uploadId, index, record) => {
      const intent = await getOwnedCampaignAssetIntent(uploadId, userId, kind);
      if (kind === 'ACCOUNTABILITY_EVIDENCE' && intent.targetCampaignId !== campaignId) {
        throw new ORPCError('NOT_FOUND', { message: 'Upload não encontrado.' });
      }

      if (intent.status === UploadIntentStatus.CONFIRMED && intent.publishedKey) {
        const asset = await prisma.campaignAsset.findUnique({ where: { id: intent.id } });
        if (!asset || asset.campaignId !== campaignId || asset.kind !== kind || asset.removedAt) {
          throw new ORPCError('BAD_REQUEST', { message: 'Este upload já foi utilizado.' });
        }
        record({
          intent,
          kind,
          publishedKey: intent.publishedKey,
          processingToken: null,
          existing: true,
        });
        return;
      }

      const claimed = await claimIntent(intent, userId, log);
      const object = await requireValidUploadedObject(
        claimed.intent,
        kind,
        log,
        claimed.token,
        deadline.foregroundSignal,
        deadline,
      );
      if (!object.ETag) {
        await withCompensationDeadline(deadline, async () => {
          await rejectIntent(claimed.intent.id, claimed.token, 'missing_etag');
          await safelyCleanupUploadIntent(claimed.intent.id, log, deadline.compensationSignal);
        });
        throw new ORPCError('BAD_REQUEST', { message: 'O arquivo enviado não pôde ser validado.' });
      }

      const publishedKey = getCampaignAssetPublishedKey({
        campaignId,
        uploadId: intent.id,
        contentType: intent.contentType,
        kind,
      });
      // Persist the deterministic destination before copying. If a foreground database operation
      // finishes after the compensation database cutoff, later intent maintenance can still remove
      // the candidate object instead of leaving an untracked R2 copy behind.
      await renewIntentLease(intent.id, claimed.token, publishedKey);
      try {
        await publishCampaignAssetObject(
          {
            sourceKey: intent.stagingKey,
            destinationKey: publishedKey,
            sourceEtag: object.ETag,
            contentType: intent.contentType,
            originalFileName: intent.originalFileName ?? 'arquivo',
          },
          deadline.foregroundSignal,
        );
      } catch (error) {
        await withCompensationDeadline(deadline, async () => {
          await rejectIntent(intent.id, claimed.token, 'publish_failed', publishedKey);
          await safelyCleanupUploadIntent(intent.id, log, deadline.compensationSignal);
        });
        throw new ORPCError('INTERNAL_SERVER_ERROR', {
          message: 'Não foi possível publicar o arquivo. Tente novamente.',
          cause: error,
        });
      }
      // Keep the local record for immediate compensation. The destination key is already durable,
      // so maintenance can also recover if the request runs out of database budget.
      record({
        intent: claimed.intent,
        kind,
        publishedKey,
        processingToken: claimed.token,
        existing: false,
      });
      await renewIntentLease(intent.id, claimed.token);
    },
    compensate: (prepared) =>
      withCompensationDeadline(deadline, () =>
        compensatePreparedCampaignAssets(prepared, log, deadline.compensationSignal),
      ),
  });
}

export async function confirmPreparedCampaignAsset({
  transaction,
  prepared,
  campaignId,
  accountabilityId,
  userId,
  position,
}: {
  transaction: Prisma.TransactionClient;
  prepared: PreparedCampaignAsset;
  campaignId: string;
  accountabilityId?: string;
  userId: string;
  position: number;
}) {
  if (prepared.existing) return;
  if (!prepared.processingToken) throw new CampaignAssetIntentOwnershipLost();

  const confirmed = await transaction.uploadIntent.updateMany({
    where: {
      id: prepared.intent.id,
      userId,
      purpose: purposeFor(prepared.kind),
      status: UploadIntentStatus.PROCESSING,
      processingToken: prepared.processingToken,
    },
    data: {
      status: UploadIntentStatus.CONFIRMED,
      activeSlot: null,
      processingToken: null,
      processingStartedAt: null,
      publishedKey: prepared.publishedKey,
      confirmedAt: new Date(),
      failureReason: null,
      cleanupPending: true,
    },
  });
  if (!confirmed.count) throw new CampaignAssetIntentOwnershipLost();

  await transaction.campaignAsset.create({
    data: {
      id: prepared.intent.id,
      campaignId,
      accountabilityId,
      uploaderId: userId,
      kind: CampaignAssetKind[prepared.kind],
      objectKey: prepared.publishedKey,
      originalFileName: prepared.intent.originalFileName ?? 'arquivo',
      contentType: prepared.intent.contentType,
      contentLength: prepared.intent.contentLength,
      position,
    },
  });
}

export async function finishPreparedCampaignAssets(
  prepared: PreparedCampaignAsset[],
  log: AssetLog,
  signal?: AbortSignal,
) {
  await Promise.all(
    prepared
      .filter((asset) => !asset.existing)
      .map((asset) => safelyCleanupUploadIntent(asset.intent.id, log, signal)),
  );
}

export async function compensatePreparedCampaignAssets(
  prepared: PreparedCampaignAsset[],
  log: AssetLog,
  signal?: AbortSignal,
) {
  await Promise.all(
    prepared.map(async (asset) => {
      if (asset.existing || !asset.processingToken) return;
      await rejectIntent(
        asset.intent.id,
        asset.processingToken,
        'database_failed',
        asset.publishedKey,
      );
      await safelyCleanupUploadIntent(asset.intent.id, log, signal);
    }),
  );
}

export async function cleanupRemovedCampaignAssets(
  userId: string,
  log: AssetLog,
  signal?: AbortSignal,
) {
  const startedAt = Date.now();
  const cleanupSignal = combineOperationSignal(
    signal ?? getActiveDeadlineSignal(),
    REMOVED_ASSET_CLEANUP_BUDGET_MS,
  );
  try {
    const assets = await prisma.campaignAsset.findMany({
      where: { uploaderId: userId, removedAt: { not: null } },
      orderBy: [{ removedAt: 'asc' }, { id: 'asc' }],
      take: REMOVED_ASSET_CLEANUP_BATCH_SIZE,
      select: { id: true },
    });
    const results: RemovedAssetCleanupResult[] = [];

    // oxlint-disable no-await-in-loop -- A chunk must settle before another bounded chunk starts.
    for (
      let index = 0;
      index < assets.length && !cleanupSignal.aborted;
      index += REMOVED_ASSET_CLEANUP_CONCURRENCY
    ) {
      const chunk = assets.slice(index, index + REMOVED_ASSET_CLEANUP_CONCURRENCY);
      const chunkResults = await Promise.all(
        chunk.map(({ id }) => safelyCleanupRemovedAsset(id, log, cleanupSignal)),
      );
      results.push(...chunkResults);
    }
    // oxlint-enable no-await-in-loop

    const completedCount = countCleanupResults(results, 'cleaned');
    const failedCount = countCleanupResults(results, 'failed');
    const skippedCount = countCleanupResults(results, 'skipped');

    log.set({
      removedAssetCleanupSelectedCount: assets.length,
      removedAssetCleanupCompletedCount: completedCount,
      removedAssetCleanupFailedCount: failedCount,
      removedAssetCleanupSkippedCount: skippedCount,
      removedAssetCleanupDeadlineReached: cleanupSignal.aborted,
      removedAssetCleanupMayRemain:
        assets.length === REMOVED_ASSET_CLEANUP_BATCH_SIZE ||
        failedCount > 0 ||
        cleanupSignal.aborted ||
        results.length < assets.length,
      removedAssetCleanupDurationMs: Date.now() - startedAt,
    });
  } catch {
    log.set({
      assetUploadStage: 'removed_asset_cleanup_failed',
      removedAssetCleanupDurationMs: Date.now() - startedAt,
    });
  }
}

export function toPublicCampaignAsset(asset: {
  id: string;
  objectKey: string;
  originalFileName: string;
  contentType: string;
  contentLength: number;
}) {
  return {
    id: asset.id,
    url: getAssetPublicUrl(asset.objectKey),
    name: asset.originalFileName,
    contentType: asset.contentType,
    contentLength: asset.contentLength,
  };
}

async function getOwnedCampaignAssetIntent(
  uploadId: string,
  userId: string,
  expectedKind?: CampaignAssetKindValue,
) {
  const intent = await prisma.uploadIntent.findUnique({ where: { id: uploadId } });
  if (!intent || !isOwnedCampaignAssetIntent({ intent, userId, kind: expectedKind })) {
    throw new ORPCError('NOT_FOUND', { message: 'Upload não encontrado.' });
  }
  return intent;
}

async function claimIntent(intent: UploadIntent, userId: string, log: AssetLog) {
  const now = new Date();
  const token = ulid();
  if (intent.status === UploadIntentStatus.PROCESSING) {
    if (!isLeaseStale(intent.processingStartedAt, now, PROCESSING_LEASE_MS)) {
      throw new ORPCError('CONFLICT', { message: 'Este upload já está sendo processado.' });
    }
    if (intent.publishedKey) {
      // A prior attempt may have copied this candidate before losing its database budget. Do not
      // reclaim and overwrite that key for another campaign; make cleanup durable first.
      const abandoned = await prisma.uploadIntent.updateMany({
        where: {
          id: intent.id,
          userId,
          status: UploadIntentStatus.PROCESSING,
          processingToken: intent.processingToken,
          processingStartedAt: intent.processingStartedAt,
        },
        data: terminalIntentData(UploadIntentStatus.REJECTED, 'processing_lease_expired'),
      });
      if (!abandoned.count) {
        throw new ORPCError('CONFLICT', {
          message: 'Este upload foi retomado por outra solicitação.',
        });
      }
      await safelyCleanupUploadIntent(intent.id, log);
      throw new ORPCError('CONFLICT', {
        message: 'O upload anterior não pôde ser confirmado. Envie o arquivo novamente.',
      });
    }
    if (intent.expiresAt <= now) {
      const expired = await expireStaleProcessingIntent(intent, now);
      if (!expired.count) {
        throw new ORPCError('CONFLICT', {
          message: 'Este upload foi retomado por outra solicitação.',
        });
      }
      await safelyCleanupUploadIntent(intent.id, log);
      throwExpiredUpload();
    }
    const reclaimed = await prisma.uploadIntent.updateMany({
      where: {
        id: intent.id,
        userId,
        status: UploadIntentStatus.PROCESSING,
        processingToken: intent.processingToken,
        processingStartedAt: intent.processingStartedAt,
      },
      data: { processingToken: token, processingStartedAt: now, failureReason: null },
    });
    if (!reclaimed.count) {
      throw new ORPCError('CONFLICT', {
        message: 'Este upload foi retomado por outra solicitação.',
      });
    }
    return {
      intent: { ...intent, processingToken: token, processingStartedAt: now },
      token,
    };
  }
  if (intent.status !== UploadIntentStatus.PENDING) {
    throw new ORPCError('BAD_REQUEST', { message: 'Este upload não está mais disponível.' });
  }
  if (intent.expiresAt <= now) {
    await expirePendingIntent(intent.id, now);
    await safelyCleanupUploadIntent(intent.id, log);
    throwExpiredUpload();
  }
  const claimed = await prisma.uploadIntent.updateMany({
    where: {
      id: intent.id,
      userId,
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
  if (!claimed.count) {
    throw new ORPCError('CONFLICT', { message: 'Este upload já está sendo processado.' });
  }
  return {
    intent: {
      ...intent,
      status: UploadIntentStatus.PROCESSING,
      processingToken: token,
      processingStartedAt: now,
    },
    token,
  };
}

async function renewIntentLease(intentId: string, processingToken: string, publishedKey?: string) {
  const renewed = await prisma.uploadIntent.updateMany({
    where: {
      id: intentId,
      status: UploadIntentStatus.PROCESSING,
      processingToken,
    },
    data: {
      processingStartedAt: new Date(),
      ...(publishedKey ? { publishedKey } : {}),
    },
  });
  if (!renewed.count) {
    throw new ORPCError('CONFLICT', {
      message: 'A confirmação deste upload foi retomada por outra solicitação.',
      cause: new CampaignAssetIntentOwnershipLost(),
    });
  }
}

async function requireValidUploadedObject(
  intent: UploadIntent,
  kind: CampaignAssetKindValue,
  log: AssetLog,
  processingToken?: string,
  signal?: AbortSignal,
  deadline?: RequestDeadline,
) {
  let object: Awaited<ReturnType<typeof headCampaignAssetObject>>;
  try {
    object = await headCampaignAssetObject(intent.stagingKey, signal);
  } catch (error) {
    if (isCampaignAssetObjectNotFound(error)) {
      if (processingToken) {
        await runIntentRepair(deadline, () =>
          rejectIntent(intent.id, processingToken, 'missing_object'),
        );
      }
      throw new ORPCError('NOT_FOUND', {
        message: 'O arquivo não foi encontrado no armazenamento. Envie novamente.',
      });
    }
    if (processingToken) {
      await runIntentRepair(deadline, () => resetIntent(intent.id, processingToken, 'head_failed'));
    }
    log.set({ assetUploadStage: 'head_failed', assetUploadId: intent.id });
    throw new ORPCError('INTERNAL_SERVER_ERROR', {
      message: 'Não foi possível verificar o arquivo. Tente novamente.',
      cause: error,
    });
  }

  if (
    !isValidCampaignAssetObject({
      kind,
      contentLength: object.ContentLength,
      contentType: object.ContentType,
      expectedLength: intent.contentLength,
      expectedType: intent.contentType,
      maxSize: intent.maxSize,
    })
  ) {
    if (processingToken) {
      await runIntentRepair(deadline, async () => {
        await rejectIntent(intent.id, processingToken, 'object_constraints_failed');
        await safelyCleanupUploadIntent(intent.id, log);
      });
    }
    throw new ORPCError('BAD_REQUEST', {
      message: 'O arquivo enviado não atende aos requisitos de formato ou tamanho.',
    });
  }
  return object;
}

function runIntentRepair<T>(deadline: RequestDeadline | undefined, callback: () => T): T {
  return deadline ? withCompensationDeadline(deadline, callback) : callback();
}

async function expirePendingIntent(intentId: string, now = new Date()) {
  return prisma.uploadIntent.updateMany({
    where: {
      id: intentId,
      status: UploadIntentStatus.PENDING,
      expiresAt: { lte: now },
    },
    data: terminalIntentData(UploadIntentStatus.EXPIRED, 'expired'),
  });
}

async function expireStaleProcessingIntent(intent: UploadIntent, now: Date) {
  return prisma.uploadIntent.updateMany({
    where: {
      id: intent.id,
      status: UploadIntentStatus.PROCESSING,
      processingToken: intent.processingToken,
      processingStartedAt: intent.processingStartedAt,
      expiresAt: { lte: now },
    },
    data: terminalIntentData(UploadIntentStatus.EXPIRED, 'processing_lease_expired'),
  });
}

async function rejectIntent(
  intentId: string,
  processingToken: string,
  reason: string,
  publishedKey?: string,
) {
  return prisma.uploadIntent.updateMany({
    where: { id: intentId, status: UploadIntentStatus.PROCESSING, processingToken },
    data: {
      ...terminalIntentData(UploadIntentStatus.REJECTED, reason),
      ...(publishedKey ? { publishedKey } : {}),
    },
  });
}

async function resetIntent(intentId: string, processingToken: string, reason: string) {
  await prisma.uploadIntent.updateMany({
    where: { id: intentId, status: UploadIntentStatus.PROCESSING, processingToken },
    data: {
      status: UploadIntentStatus.PENDING,
      processingToken: null,
      processingStartedAt: null,
      failureReason: reason,
    },
  });
}

function terminalIntentData(status: 'REJECTED' | 'EXPIRED', failureReason: string) {
  return {
    status,
    activeSlot: null,
    processingToken: null,
    processingStartedAt: null,
    failureReason,
    cleanupPending: true,
  };
}

async function maintainCampaignAssetUploads(userId: string, log: AssetLog) {
  const now = new Date();
  const staleProcessing = new Date(now.getTime() - PROCESSING_LEASE_MS);
  await prisma.uploadIntent.updateMany({
    where: {
      userId,
      purpose: { in: [...CAMPAIGN_ASSET_PURPOSES] },
      status: UploadIntentStatus.PENDING,
      expiresAt: { lte: now },
    },
    data: terminalIntentData(UploadIntentStatus.EXPIRED, 'expired'),
  });
  await prisma.uploadIntent.updateMany({
    where: {
      userId,
      purpose: { in: [...CAMPAIGN_ASSET_PURPOSES] },
      status: UploadIntentStatus.PROCESSING,
      expiresAt: { lte: now },
      OR: [{ processingStartedAt: null }, { processingStartedAt: { lte: staleProcessing } }],
    },
    data: terminalIntentData(UploadIntentStatus.EXPIRED, 'processing_lease_expired'),
  });
  const intents = await prisma.uploadIntent.findMany({
    where: {
      userId,
      purpose: { in: [...CAMPAIGN_ASSET_PURPOSES] },
      cleanupPending: true,
      status: {
        in: [UploadIntentStatus.CONFIRMED, UploadIntentStatus.REJECTED, UploadIntentStatus.EXPIRED],
      },
    },
    orderBy: { updatedAt: 'asc' },
    take: 25,
    select: { id: true },
  });
  await Promise.all(intents.map(({ id }) => safelyCleanupUploadIntent(id, log)));
  await cleanupRemovedCampaignAssets(userId, log);
  await prisma.uploadIntent.deleteMany({
    where: {
      userId,
      purpose: { in: [...CAMPAIGN_ASSET_PURPOSES] },
      cleanupPending: false,
      status: {
        in: [UploadIntentStatus.CONFIRMED, UploadIntentStatus.REJECTED, UploadIntentStatus.EXPIRED],
      },
      updatedAt: { lt: new Date(now.getTime() - INTENT_RETENTION_MS) },
    },
  });
}

async function safelyCleanupUploadIntent(intentId: string, log: AssetLog, signal?: AbortSignal) {
  await withActiveCompensationDeadline(async () => {
    try {
      const intent = await prisma.uploadIntent.findUnique({ where: { id: intentId } });
      if (!intent?.cleanupPending) return;
      const keys = [intent.stagingKey];
      if (intent.status !== UploadIntentStatus.CONFIRMED && intent.publishedKey) {
        keys.push(intent.publishedKey);
      }
      const results = await Promise.all(
        [...new Set(keys)].map(async (key) => {
          try {
            await deleteCampaignAssetObject(key, signal);
            return true;
          } catch {
            return false;
          }
        }),
      );
      await prisma.uploadIntent.updateMany({
        where: { id: intent.id, status: intent.status },
        data: { cleanupPending: results.some((result) => !result) },
      });
    } catch (error) {
      log.set({ assetUploadStage: 'cleanup_failed', cleanupIntentId: intentId });
      void error;
    }
  });
}

type RemovedAssetCleanupResult = 'cleaned' | 'failed' | 'skipped';

function countCleanupResults(
  results: RemovedAssetCleanupResult[],
  result: RemovedAssetCleanupResult,
) {
  return results.filter((current) => current === result).length;
}

async function safelyCleanupRemovedAsset(
  assetId: string,
  log: AssetLog,
  signal?: AbortSignal,
): Promise<RemovedAssetCleanupResult> {
  return withActiveCompensationDeadline(async () => {
    try {
      if (signal?.aborted) return 'skipped';

      const asset = await prisma.campaignAsset.findUnique({ where: { id: assetId } });
      if (!asset?.removedAt || signal?.aborted) return 'skipped';

      await deleteCampaignAssetObject(asset.objectKey, signal);
      // If the batch ran out of time after R2 accepted the delete, leave the tombstone behind.
      // A later request can repeat the idempotent object delete and remove the row safely.
      if (signal?.aborted) return 'skipped';

      const deleted = await prisma.campaignAsset.deleteMany({
        where: { id: asset.id, removedAt: { not: null } },
      });
      return deleted.count ? 'cleaned' : 'skipped';
    } catch (error) {
      log.set({ assetUploadStage: 'asset_cleanup_failed', cleanupAssetId: assetId });
      void error;
      return 'failed';
    }
  });
}

async function persistIntentInAvailableSlot({
  slotIndex = 0,
  ...data
}: {
  uploadId: string;
  userId: string;
  purpose: 'CAMPAIGN_IMAGE' | 'ACCOUNTABILITY_EVIDENCE';
  stagingKey: string;
  originalFileName: string;
  targetCampaignId: string | null;
  contentType: string;
  contentLength: number;
  maxSize: number;
  expiresAt: Date;
  slotIndex?: number;
}): Promise<boolean> {
  const activeSlot = ACTIVE_UPLOAD_SLOTS[slotIndex];
  if (!activeSlot) return false;
  try {
    await prisma.uploadIntent.create({
      data: {
        id: data.uploadId,
        userId: data.userId,
        purpose: data.purpose,
        activeSlot,
        stagingKey: data.stagingKey,
        originalFileName: data.originalFileName,
        targetCampaignId: data.targetCampaignId,
        contentType: data.contentType,
        contentLength: data.contentLength,
        maxSize: data.maxSize,
        expiresAt: data.expiresAt,
      },
    });
    return true;
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
      throw error;
    }
    const occupied = await prisma.uploadIntent.findFirst({
      where: { userId: data.userId, purpose: data.purpose, activeSlot },
      select: { id: true },
    });
    if (!occupied) throw error;
    return persistIntentInAvailableSlot({ ...data, slotIndex: slotIndex + 1 });
  }
}

function purposeFor(kind: CampaignAssetKindValue) {
  return kind === 'IMAGE'
    ? UploadIntentPurpose.CAMPAIGN_IMAGE
    : UploadIntentPurpose.ACCOUNTABILITY_EVIDENCE;
}

function kindFor(purpose: string): CampaignAssetKindValue {
  if (purpose === UploadIntentPurpose.CAMPAIGN_IMAGE) return 'IMAGE';
  if (purpose === UploadIntentPurpose.ACCOUNTABILITY_EVIDENCE) return 'ACCOUNTABILITY_EVIDENCE';
  throw new ORPCError('NOT_FOUND', { message: 'Upload não encontrado.' });
}

function throwExpiredUpload(): never {
  throw new ORPCError('BAD_REQUEST', {
    message: 'O upload expirou. Selecione o arquivo novamente.',
  });
}

function throwUploadRateLimit(): never {
  throw new ORPCError('TOO_MANY_REQUESTS', {
    message: 'Muitas tentativas de upload. Aguarde alguns minutos e tente novamente.',
  });
}
