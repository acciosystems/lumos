import { Prisma } from '@lumos/database/generated/prisma/client';
import {
  CampaignStatus,
  CampaignType,
  type CampaignAccountabilityInput,
} from '@lumos/validation/campaign';
import { ORPCError } from '@orpc/client';

import {
  confirmPreparedCampaignAsset,
  toPublicCampaignAsset,
  type PreparedCampaignAsset,
} from './campaign-assets';
import { CAMPAIGN_TIME_ZONE, reconcileCampaignLifecycle } from './campaign-lifecycle';

export const CAMPAIGN_ACCOUNTABILITY_TIME_ZONE = CAMPAIGN_TIME_ZONE;

export type CampaignAccountabilityStatus =
  | 'NOT_REQUIRED'
  | 'OUTSTANDING'
  | 'OVERDUE'
  | 'SUBMITTED_ON_TIME'
  | 'SUBMITTED_LATE';

/**
 * Campaign dates are persisted as PostgreSQL calendar dates and represented by
 * Prisma as UTC-midnight dates. This helper converts the seventh following
 * calendar day at 23:59:59 in São Paulo into the UTC instant used for
 * server-side comparisons.
 */
export function getCampaignAccountabilityDeadline(endDate: Date): Date {
  const endCalendarDate = new Date(
    Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate() + 7),
  );
  const wallClock = Date.UTC(
    endCalendarDate.getUTCFullYear(),
    endCalendarDate.getUTCMonth(),
    endCalendarDate.getUTCDate(),
    23,
    59,
    59,
  );

  // Resolve the IANA timezone offset twice so this remains correct if the
  // timezone rules ever include a transition around the target date.
  const firstCandidate = new Date(wallClock - getTimeZoneOffset(new Date(wallClock)));
  return new Date(wallClock - getTimeZoneOffset(firstCandidate));
}

export function getCampaignAccountabilityStatus({
  campaignStatus,
  accountability,
  deadline,
  now = new Date(),
}: {
  campaignStatus: CampaignStatus | string;
  accountability?: { submittedOnTime: boolean } | null;
  deadline?: Date | null;
  now?: Date;
}): CampaignAccountabilityStatus {
  if (campaignStatus !== CampaignStatus.COMPLETED || !deadline) return 'NOT_REQUIRED';
  if (!accountability) return now > deadline ? 'OVERDUE' : 'OUTSTANDING';
  return accountability.submittedOnTime ? 'SUBMITTED_ON_TIME' : 'SUBMITTED_LATE';
}

export function toPublicCampaignAccountability(
  accountability: {
    totalItems: number | null;
    totalAmountCents: number | null;
    outcomeSummary: string;
    evidenceAssets: Array<{
      id: string;
      objectKey: string;
      originalFileName: string;
      contentType: string;
      contentLength: number;
    }>;
  } | null,
) {
  if (!accountability) return null;

  return {
    totalItems: accountability.totalItems,
    totalAmountCents: accountability.totalAmountCents,
    outcomeSummary: accountability.outcomeSummary,
    evidenceAssets: accountability.evidenceAssets.map(toPublicCampaignAsset),
  };
}

export async function saveCampaignAccountability(
  transaction: Prisma.TransactionClient,
  userId: string,
  input: CampaignAccountabilityInput,
  preparedAssets: PreparedCampaignAsset[],
  now = new Date(),
) {
  await transaction.$queryRaw(Prisma.sql`
    SELECT "id" FROM "campaigns" WHERE "id" = ${input.id} FOR UPDATE
  `);
  await reconcileCampaignLifecycle(transaction, input.id, now);

  const campaign = await transaction.campaign.findFirst({
    where: {
      id: input.id,
      organizerProfile: { userId },
    },
    select: {
      id: true,
      status: true,
      type: true,
      endDate: true,
      accountability: {
        select: {
          id: true,
          evidenceAssets: {
            where: { removedAt: null },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!campaign) {
    throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
  }

  if (campaign.status !== CampaignStatus.COMPLETED) {
    throw new ORPCError('BAD_REQUEST', {
      message: 'A prestação de contas só pode ser enviada após concluir a campanha.',
    });
  }

  if (campaign.type !== input.type) {
    throw new ORPCError('BAD_REQUEST', {
      message: 'O resultado informado não corresponde ao tipo da campanha.',
    });
  }

  const deadline = getCampaignAccountabilityDeadline(campaign.endDate);
  const submittedOnTime = now <= deadline;
  const result =
    input.type === CampaignType.PHYSICAL
      ? { totalItems: input.totalItems, totalAmountCents: null }
      : { totalItems: null, totalAmountCents: input.totalAmountCents };

  const currentAssetIds = new Set(
    campaign.accountability?.evidenceAssets.map((asset) => asset.id) ?? [],
  );
  if (input.retainedEvidenceAssetIds.some((assetId) => !currentAssetIds.has(assetId))) {
    throw new ORPCError('BAD_REQUEST', {
      message: 'Uma das evidências mantidas não pertence a esta prestação de contas.',
    });
  }

  const accountability = await transaction.campaignAccountability.upsert({
    where: { campaignId: campaign.id },
    create: {
      campaignId: campaign.id,
      ...result,
      outcomeSummary: input.outcomeSummary,
      submittedAt: now,
      submittedOnTime,
    },
    update: {
      ...result,
      outcomeSummary: input.outcomeSummary,
    },
  });

  const confirmedPreparedAssetIds = preparedAssets
    .filter((asset) => asset.existing)
    .map((asset) => asset.intent.id);
  const effectiveRetainedAssetIds = [
    ...input.retainedEvidenceAssetIds,
    ...confirmedPreparedAssetIds,
  ];
  const effectiveRetainedAssetIdSet = new Set(effectiveRetainedAssetIds);
  const removedAssetIds = [...currentAssetIds].filter(
    (assetId) => !effectiveRetainedAssetIdSet.has(assetId),
  );
  if (removedAssetIds.length) {
    await transaction.campaignAsset.updateMany({
      where: { id: { in: removedAssetIds }, accountabilityId: accountability.id, removedAt: null },
      data: { removedAt: now },
    });
  }

  await Promise.all(
    input.retainedEvidenceAssetIds.map((assetId, position) =>
      transaction.campaignAsset.updateMany({
        where: { id: assetId, accountabilityId: accountability.id, removedAt: null },
        data: { position },
      }),
    ),
  );
  await Promise.all(
    preparedAssets.map((prepared, index) => {
      const position = input.retainedEvidenceAssetIds.length + index;
      return prepared.existing
        ? transaction.campaignAsset.updateMany({
            where: {
              id: prepared.intent.id,
              accountabilityId: accountability.id,
              removedAt: null,
            },
            data: { position },
          })
        : confirmPreparedCampaignAsset({
            transaction,
            prepared,
            campaignId: campaign.id,
            accountabilityId: accountability.id,
            userId,
            position,
          });
    }),
  );

  return transaction.campaignAccountability.findUniqueOrThrow({
    where: { id: accountability.id },
    include: {
      evidenceAssets: {
        where: { removedAt: null },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      },
    },
  });
}

function getTimeZoneOffset(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CAMPAIGN_ACCOUNTABILITY_TIME_ZONE,
    calendar: 'iso8601',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const values: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') values[part.type] = part.value;
  }

  const localAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return localAsUtc - date.getTime();
}
