import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import * as v from 'valibot';

import { CampaignDashboard } from '@/components/campaign/campaign-dashboard';
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
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(rpc.campaign.byId.queryOptions({ input: { id } }));

  return (
    <AppInset
      breadcrumbs={[
        { label: 'Campanhas', href: '/campaigns' },
        { label: 'Minhas campanhas', href: '/campaigns/my' },
        { label: 'Detalhes' },
      ]}
    >
      <CampaignDashboard campaign={data} />
    </AppInset>
  );
}
