import { Prisma } from '@lumos/database/generated/prisma/client';
import {
  CampaignStatus,
  CampaignType,
  type CampaignAccountabilityInput,
} from '@lumos/validation/campaign';
import { ORPCError } from '@orpc/client';

export const CAMPAIGN_ACCOUNTABILITY_TIME_ZONE = 'America/Sao_Paulo';

export type CampaignAccountabilityStatus =
  | 'NOT_REQUIRED'
  | 'OUTSTANDING'
  | 'OVERDUE'
  | 'SUBMITTED_ON_TIME'
  | 'SUBMITTED_LATE';

/**
 * Campaign dates are persisted as UTC-midnight calendar dates. This helper
 * converts the seventh following calendar day at 23:59:59 in São Paulo into
 * the UTC instant used for server-side comparisons.
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
    evidenceUrls: string[] | null;
  } | null,
) {
  if (!accountability) return null;

  return {
    totalItems: accountability.totalItems,
    totalAmountCents: accountability.totalAmountCents,
    outcomeSummary: accountability.outcomeSummary,
    evidenceUrls: accountability.evidenceUrls ?? [],
  };
}

export async function saveCampaignAccountability(
  transaction: Prisma.TransactionClient,
  userId: string,
  input: CampaignAccountabilityInput,
  now = new Date(),
) {
  await transaction.$queryRaw(Prisma.sql`
    SELECT "id" FROM "campaigns" WHERE "id" = ${input.id} FOR UPDATE
  `);

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

  return transaction.campaignAccountability.upsert({
    where: { campaignId: campaign.id },
    create: {
      campaignId: campaign.id,
      ...result,
      outcomeSummary: input.outcomeSummary,
      evidenceUrls: input.evidenceUrls,
      submittedAt: now,
      submittedOnTime,
    },
    update: {
      ...result,
      outcomeSummary: input.outcomeSummary,
      evidenceUrls: input.evidenceUrls,
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
