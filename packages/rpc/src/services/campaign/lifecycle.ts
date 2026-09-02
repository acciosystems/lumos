import type { Prisma } from '@lumos/database/generated/prisma/client';
import { CampaignStatus } from '@lumos/validation/campaign';
import {
  getAutomaticCompletionAt,
  getEffectiveCampaignStatus,
  getSaoPauloCalendarDate,
  toCampaignCalendarDate,
} from '@lumos/validation/campaign-calendar';

export {
  CAMPAIGN_TIME_ZONE,
  getAutomaticCompletionAt,
  getEffectiveCampaignStatus,
  getSaoPauloCalendarDate,
  getSaoPauloMidnight,
  toCampaignCalendarDate,
  type CampaignLifecycleState,
} from '@lumos/validation/campaign-calendar';

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
