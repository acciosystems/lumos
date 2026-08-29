import { CampaignStatus } from '@lumos/validation/campaign';
import { useEffect, useState } from 'react';

import {
  getCampaignEffectiveStatus,
  getNextCampaignLifecycleCheckAt,
} from '@/utils/campaign-status';

type CampaignStatusInput = Parameters<typeof getCampaignEffectiveStatus>[0];
const MAX_BROWSER_TIMEOUT_MS = 2_147_000_000;

/** Refreshes the derived status while a campaign page remains open. */
export function useCampaignEffectiveStatus(campaign: CampaignStatusInput) {
  const [now, setNow] = useState(() => new Date());
  const status = getCampaignEffectiveStatus({ ...campaign, now });

  useEffect(() => {
    const refresh = () => setNow(new Date());
    document.addEventListener('visibilitychange', refresh);

    const boundary = getNextCampaignLifecycleCheckAt({
      status,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    });
    const timer =
      status === CampaignStatus.PENDING || status === CampaignStatus.ACTIVE
        ? window.setTimeout(
            refresh,
            Math.min(
              MAX_BROWSER_TIMEOUT_MS,
              Math.max(100, boundary ? boundary.getTime() - Date.now() + 50 : 60_000),
            ),
          )
        : undefined;

    return () => {
      document.removeEventListener('visibilitychange', refresh);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [campaign.endDate, campaign.startDate, campaign.status, status, now]);

  return status;
}
