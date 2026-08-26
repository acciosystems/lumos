import { CampaignStatus } from '@lumos/validation/campaign';
import { IconAlertCircle } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as v from 'valibot';

import { CampaignDetailsForm } from '@/components/campaign/campaign-details-form';
import { Loading } from '@/components/misc/loading';
import { AppInset } from '@/components/sidebar/inset';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { rpc } from '@/lib/rpc';

const paramsSchema = v.object({
  id: v.pipe(v.string(), v.ulid()),
});

export const Route = createFileRoute('/(app)/campaigns/my_/$id_/edit')({
  params: {
    parse: (params) => v.parse(paramsSchema, params),
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      rpc.campaign.byId.queryOptions({ input: { id: params.id } }),
    ),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `Editar ${loaderData.title}` : 'Editar campanha' }],
  }),
  pendingComponent: () => (
    <AppInset breadcrumbs={[{ label: 'Minhas campanhas', href: '/campaigns/my' }]}>
      <Loading description="Carregando campanha" />
    </AppInset>
  ),
  component: EditCampaignPage,
});

function EditCampaignPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: campaign } = useSuspenseQuery(rpc.campaign.byId.queryOptions({ input: { id } }));

  const goToCampaign = () => navigate({ to: '/campaigns/my/$id', params: { id: campaign.id } });

  return (
    <AppInset
      breadcrumbs={[
        { label: 'Campanhas', href: '/campaigns' },
        { label: 'Minhas campanhas', href: '/campaigns/my' },
        { label: 'Detalhes', href: `/campaigns/my/${campaign.id}` },
        { label: 'Editar' },
      ]}
    >
      <div className="flex w-full flex-col gap-5">
        {campaign.status === CampaignStatus.ACTIVE ? (
          <CampaignDetailsForm campaign={campaign} onCancel={goToCampaign} onSuccess={goToCampaign} />
        ) : (
          <Alert className="w-fit pb-14 has-data-[slot=alert-action]:pr-4">
            <IconAlertCircle />
            <AlertTitle>Campanha não pode ser editada</AlertTitle>
            <AlertDescription>Apenas campanhas ativas podem ser editadas.</AlertDescription>
            <AlertAction className="top-auto bottom-3">
              <Button type="button" size="sm" onClick={goToCampaign}>
                Voltar ao painel
              </Button>
            </AlertAction>
          </Alert>
        )}
      </div>
    </AppInset>
  );
}
