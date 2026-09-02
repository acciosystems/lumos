import { CampaignStatus } from '@lumos/validation/campaign';
import {
  addCampaignCalendarDays,
  getSaoPauloCalendarDate,
  getSaoPauloMidnight,
  toCampaignCalendarDate,
} from '@lumos/validation/campaign-calendar';

export { getEffectiveCampaignStatus as getCampaignEffectiveStatus } from '@lumos/validation/campaign-calendar';

type CampaignStatusMetadata = {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
};

export const campaignStatusMetadata = {
  [CampaignStatus.PENDING]: { label: 'Pendente', variant: 'secondary' },
  [CampaignStatus.ACTIVE]: { label: 'Ativa', variant: 'default' },
  [CampaignStatus.COMPLETED]: { label: 'Concluída', variant: 'outline' },
  [CampaignStatus.CANCELLED]: { label: 'Cancelada', variant: 'destructive' },
} satisfies Record<CampaignStatus, CampaignStatusMetadata>;

type CampaignLifecycleDates = {
  status: CampaignStatus;
  startDate: Date | string;
  endDate: Date | string;
};

/** Returns the next São Paulo midnight at which a non-terminal status can change. */
export function getNextCampaignLifecycleCheckAt({
  status,
  startDate,
  endDate,
}: CampaignLifecycleDates): Date | null {
  if (status === CampaignStatus.PENDING) {
    return getSaoPauloMidnight(toCampaignCalendarDate(startDate));
  }

  if (status === CampaignStatus.ACTIVE) {
    const end = toCampaignCalendarDate(endDate);
    return getSaoPauloMidnight(addCampaignCalendarDays(end, 1));
  }

  return null;
}

/** Delay until the next campaign calendar day begins in São Paulo. */
export function getMillisecondsUntilNextCampaignDay(now = new Date()) {
  const nextDay = addCampaignCalendarDays(getSaoPauloCalendarDate(now), 1);
  return Math.max(100, getSaoPauloMidnight(nextDay).getTime() - now.getTime() + 50);
}
