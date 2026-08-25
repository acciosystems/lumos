import type { QueryClient } from '@tanstack/react-query';

import { rpc } from '@/lib/rpc';

interface CampaignParticipationQueryInput {
  campaignId: string;
  viewerId: string;
}

export function campaignParticipationQueryOptions({
  campaignId,
  viewerId,
}: CampaignParticipationQueryInput) {
  const input = { id: campaignId };
  const queryKey = [...rpc.campaign.participationState.queryKey({ input }), { viewerId }] as const;

  return rpc.campaign.participationState.queryOptions({ input, queryKey });
}

export async function invalidateCampaignLists(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: rpc.campaign.list.key({ type: 'query' }),
    }),
    queryClient.invalidateQueries({
      queryKey: rpc.campaign.myCampaigns.queryKey(),
    }),
  ]);
}

export async function invalidateCampaignParticipation(
  queryClient: QueryClient,
  input: CampaignParticipationQueryInput,
) {
  const { campaignId, viewerId } = input;

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: rpc.campaign.publicById.queryKey({ input: { id: campaignId } }),
    }),
    queryClient.invalidateQueries({
      queryKey: rpc.campaign.list.key({ type: 'query' }),
    }),
    queryClient.invalidateQueries({
      queryKey: rpc.campaign.byId.queryKey({ input: { id: campaignId } }),
    }),
    queryClient.invalidateQueries({
      queryKey: rpc.campaign.myCampaigns.queryKey(),
    }),
    queryClient.invalidateQueries({
      queryKey: rpc.campaign.myParticipations.queryKey(),
    }),
    queryClient.invalidateQueries({
      queryKey: campaignParticipationQueryOptions({ campaignId, viewerId }).queryKey,
    }),
  ]);
}
