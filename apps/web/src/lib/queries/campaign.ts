import type { CampaignListInput } from '@lumos/validation/campaign';
import type { QueryClient } from '@tanstack/react-query';

import { rpc } from '@/lib/rpc';

interface CampaignParticipationQueryInput {
  campaignId: string;
  viewerId: string;
}

type CampaignListFilters = Omit<CampaignListInput, 'cursor' | 'limit'>;

export function campaignListInfiniteOptions(filters: CampaignListFilters) {
  return rpc.campaign.list.infiniteOptions({
    input: (cursor: string | null) => ({
      ...filters,
      cursor: cursor ?? undefined,
    }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
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
      queryKey: rpc.campaign.list.key(),
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
      queryKey: rpc.campaign.list.key(),
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

export async function invalidateCampaignManagement(queryClient: QueryClient, campaignId: string) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: rpc.campaign.publicById.queryKey({ input: { id: campaignId } }),
    }),
    queryClient.invalidateQueries({
      queryKey: rpc.campaign.list.key(),
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
      queryKey: rpc.campaign.participationState.key(),
    }),
  ]);
}
