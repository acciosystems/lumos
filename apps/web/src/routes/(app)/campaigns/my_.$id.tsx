import { createFileRoute } from '@tanstack/react-router';
import * as v from 'valibot';

import { CampaignDetail } from '@/components/campaign/campaign-detail';
import { Loading } from '@/components/misc/loading';
import { AppInset } from '@/components/sidebar/inset';
import { rpc } from '@/lib/rpc';

const paramsSchema = v.object({
  id: v.pipe(v.string(), v.ulid()),
});

export const Route = createFileRoute('/(app)/campaigns/my_/$id')({
  params: {
    parse: (params) => v.parse(paramsSchema, params),
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      rpc.campaign.byId.queryOptions({ input: { id: params.id } }),
    ),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.title} | Minhas campanhas` : 'Minhas campanhas' }],
  }),
  pendingComponent: () => (
    <AppInset breadcrumbs={[{ label: 'Minhas campanhas', href: '/campaigns/my' }]}>
      <Loading description="Carregando campanha" />
    </AppInset>
  ),
  component: OwnerCampaignDetailPage,
});

function OwnerCampaignDetailPage() {
  const data = Route.useLoaderData();

  return (
    <AppInset
      breadcrumbs={[
        { label: 'Campanhas', href: '/campaigns' },
        { label: 'Minhas campanhas', href: '/campaigns/my' },
        { label: 'Detalhes' },
      ]}
    >
      <CampaignDetail campaign={data} />
    </AppInset>
  );
}
