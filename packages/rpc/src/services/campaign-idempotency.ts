import { createHash } from 'node:crypto';

import { prisma } from '@lumos/database';
import { CampaignOperationKind, Prisma } from '@lumos/database/generated/prisma/client';
import { ORPCError } from '@orpc/client';
import { ulid } from 'ulid';

const RETENTION_MS = 24 * 60 * 60 * 1000;

export type CampaignIdempotencyLog = {
  set: (fields: Record<string, unknown>) => void;
};

type ReserveCampaignOperationInput = {
  actorId: string;
  kind: CampaignOperationKind;
  operationKey: string;
  payload: unknown;
  log?: CampaignIdempotencyLog;
};

export type CampaignOperationReservation = {
  resourceId: string;
  replay: boolean;
};

/**
 * Reserve a resource ID for one client operation and return it for retries.
 * The resource itself is created by the caller, allowing an interrupted
 * request to resume without introducing a second campaign or update.
 */
export async function reserveCampaignOperation({
  actorId,
  kind,
  operationKey,
  payload,
  log,
}: ReserveCampaignOperationInput): Promise<CampaignOperationReservation> {
  const now = new Date();
  const requestFingerprint = fingerprintCampaignOperation(payload);

  await prisma.campaignIdempotencyRecord.deleteMany({
    where: { operationKey, expiresAt: { lte: now } },
  });
  await cleanupExpiredCampaignOperations(log);

  const resourceId = ulid();
  try {
    const record = await prisma.campaignIdempotencyRecord.create({
      data: {
        operationKey,
        requestFingerprint,
        kind,
        actorId,
        resourceId,
        expiresAt: new Date(now.getTime() + RETENTION_MS),
      },
    });

    log?.set({
      idempotencyOperation: kind,
      idempotencyOutcome: 'reserved',
      idempotencyRecordId: record.id,
    });
    return { resourceId: record.resourceId, replay: false };
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
      throw error;
    }
  }

  const existing = await prisma.campaignIdempotencyRecord.findUnique({
    where: { operationKey },
  });
  if (!existing) throw new Error('Idempotency reservation disappeared after a unique conflict.');

  if (
    existing.actorId !== actorId ||
    existing.kind !== kind ||
    existing.requestFingerprint !== requestFingerprint
  ) {
    log?.set({
      idempotencyOperation: kind,
      idempotencyOutcome: 'conflict',
      idempotencyRecordId: existing.id,
    });
    throw new ORPCError('CONFLICT', {
      message: 'Esta chave de operação já foi usada para outra solicitação.',
    });
  }

  log?.set({
    idempotencyOperation: kind,
    idempotencyOutcome: 'replayed',
    idempotencyRecordId: existing.id,
  });
  return { resourceId: existing.resourceId, replay: true };
}

export function fingerprintCampaignOperation(payload: unknown) {
  return createHash('sha256').update(stableSerialize(payload)).digest('hex');
}

function stableSerialize(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number')
    return Number.isFinite(value) ? String(value) : JSON.stringify(value);
  if (typeof value !== 'object') return JSON.stringify(String(value));

  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`;

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .toSorted()
    .map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`)
    .join(',')}}`;
}

async function cleanupExpiredCampaignOperations(log?: CampaignIdempotencyLog) {
  try {
    await prisma.$executeRaw(
      Prisma.sql`DELETE FROM "campaign_idempotency_records"
        WHERE "id" IN (
          SELECT "id"
          FROM "campaign_idempotency_records"
          WHERE "expiresAt" <= NOW()
          ORDER BY "expiresAt" ASC
          LIMIT 100
        )`,
    );
  } catch {
    // Cleanup is best effort; the reservation remains the authoritative write.
    log?.set({ idempotencyCleanupFailed: true });
  }
}
