import type { Prisma } from '@lumos/database/generated/prisma/client';
import { CampaignStatus } from '@lumos/validation/campaign';

export const CAMPAIGN_TIME_ZONE = 'America/Sao_Paulo';

type LifecycleStatus = CampaignStatus;

export type CampaignLifecycleState = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

/**
 * Campaign start and end values are calendar dates. The server owns the
 * timezone conversion so a browser in another timezone cannot shift a boundary.
 */
export function getSaoPauloCalendarDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CAMPAIGN_TIME_ZONE,
    calendar: 'iso8601',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const values: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') values[part.type] = part.value;
  }
  return `${values.year}-${values.month}-${values.day}`;
}

/** Converts a persisted DATE value into its stable YYYY-MM-DD representation. */
export function toCampaignCalendarDate(value: Date | string): string {
  if (typeof value === 'string') return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

/** Returns the UTC instant corresponding to São Paulo midnight on a calendar date. */
export function getSaoPauloMidnight(calendarDate: string): Date {
  const [year, month, day] = calendarDate.split('-').map(Number) as [number, number, number];
  const wallClock = Date.UTC(year, month - 1, day);
  const firstCandidate = new Date(wallClock - getTimeZoneOffset(new Date(wallClock)));
  return new Date(wallClock - getTimeZoneOffset(firstCandidate));
}

export function getAutomaticCompletionAt(endDate: Date | string): Date {
  const end = toCampaignCalendarDate(endDate);
  const [year, month, day] = end.split('-').map(Number) as [number, number, number];
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1));
  const calendarDate = [
    nextDay.getUTCFullYear(),
    String(nextDay.getUTCMonth() + 1).padStart(2, '0'),
    String(nextDay.getUTCDate()).padStart(2, '0'),
  ].join('-');
  return getSaoPauloMidnight(calendarDate);
}

export function getEffectiveCampaignStatus({
  status,
  startDate,
  endDate,
  now = new Date(),
}: {
  status: LifecycleStatus;
  startDate: Date | string;
  endDate: Date | string;
  now?: Date;
}): CampaignLifecycleState {
  if (status === CampaignStatus.CANCELLED || status === CampaignStatus.COMPLETED) return status;

  const today = getSaoPauloCalendarDate(now);
  const start = toCampaignCalendarDate(startDate);
  const end = toCampaignCalendarDate(endDate);
  if (today < start) return CampaignStatus.PENDING;
  if (today > end) return CampaignStatus.COMPLETED;
  return CampaignStatus.ACTIVE;
}

export function isCampaignActiveOnDate(
  startDate: Date | string,
  endDate: Date | string,
  now = new Date(),
) {
  return (
    getEffectiveCampaignStatus({
      status: CampaignStatus.ACTIVE,
      startDate,
      endDate,
      now,
    }) === CampaignStatus.ACTIVE
  );
}

export function assertCampaignDatesNotEnded(
  startDate: Date | string,
  endDate: Date | string,
  now = new Date(),
) {
  const today = getSaoPauloCalendarDate(now);
  const start = toCampaignCalendarDate(startDate);
  const end = toCampaignCalendarDate(endDate);
  if (end < today) return false;
  if (end <= start) return false;
  return true;
}

/**
 * Reconcile one row from a request snapshot. State transitions are guarded by
 * their current status and date predicates so public reads do not need to take
 * an exclusive row lock; state-changing callers still invoke this in a
 * transaction before applying their own mutation.
 */
export async function reconcileCampaignLifecycle(
  transaction: Prisma.TransactionClient,
  campaignId: string,
  now = new Date(),
) {
  const today = getSaoPauloCalendarDate(now);
  const todayDate = new Date(`${today}T00:00:00.000Z`);
  const campaign = await transaction.campaign.findUnique({
    where: { id: campaignId },
    select: { startDate: true, endDate: true, status: true, completedAt: true },
  });

  if (!campaign || campaign.status === CampaignStatus.CANCELLED) return;

  // The database invariant requires status and completedAt to change together.
  if (campaign.endDate < todayDate && campaign.status !== CampaignStatus.COMPLETED) {
    await transaction.campaign.updateMany({
      where: {
        id: campaignId,
        status: campaign.status,
        endDate: { lt: todayDate },
      },
      data: {
        status: CampaignStatus.COMPLETED,
        completedAt: getAutomaticCompletionAt(campaign.endDate),
      },
    });
    return;
  }

  if (campaign.status === CampaignStatus.COMPLETED) {
    if (!campaign.completedAt) {
      await transaction.campaign.updateMany({
        where: { id: campaignId, status: CampaignStatus.COMPLETED, completedAt: null },
        data: { completedAt: getAutomaticCompletionAt(campaign.endDate) },
      });
    }
    return;
  }

  if (campaign.status === CampaignStatus.ACTIVE && campaign.startDate > todayDate) {
    await transaction.campaign.updateMany({
      where: { id: campaignId, status: CampaignStatus.ACTIVE, startDate: { gt: todayDate } },
      data: { status: CampaignStatus.PENDING },
    });
    return;
  }

  if (
    campaign.status === CampaignStatus.PENDING &&
    campaign.startDate <= todayDate &&
    campaign.endDate >= todayDate
  ) {
    await transaction.campaign.updateMany({
      where: {
        id: campaignId,
        status: CampaignStatus.PENDING,
        startDate: { lte: todayDate },
        endDate: { gte: todayDate },
      },
      data: { status: CampaignStatus.ACTIVE },
    });
  }
}

function getTimeZoneOffset(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CAMPAIGN_TIME_ZONE,
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
