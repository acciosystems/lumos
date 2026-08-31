import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ptBR } from 'date-fns/locale';

import { Loading } from '@/components/misc/loading';
import { AppInset } from '@/components/sidebar/inset';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { useCampaignEffectiveStatus } from '@/hooks/use-campaign-effective-status';
import { myCampaignsInfiniteOptions } from '@/lib/queries/campaign';
import { rpc } from '@/lib/rpc';
import { formatCampaignDate } from '@/utils/campaign-date';
import { campaignStatusMetadata } from '@/utils/campaign-status';
import { isPhysicalCampaign } from '@/utils/campaign-type';

export const Route = createFileRoute('/(app)/campaigns/my')({
  loader: () => ({
    breadcrumb: [{ label: 'Campanhas', href: '/campaigns' }, { label: 'Minhas campanhas' }],
  }),
  component: MyCampaignsPage,
});

function MyCampaignsPage() {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  } = useInfiniteQuery(myCampaignsInfiniteOptions());
  const campaigns = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <AppInset
      breadcrumbs={[{ label: 'Campanhas', href: '/campaigns' }, { label: 'Minhas campanhas' }]}
    >
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold">Minhas campanhas</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe as campanhas criadas por você.
            </p>
          </div>
          <Button nativeButton={false} render={<Link to="/campaigns/new" />}>
            <IconPlus /> Criar campanha
          </Button>
        </div>

        {isPending && <Loading description="Carregando suas campanhas" />}

        {isError && (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Falha ao carregar campanhas</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {data &&
          (campaigns.length ? (
            <div className="grid auto-rows-fr gap-3">
              {campaigns.map((campaign) => (
                <MyCampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Nenhuma campanha criada</EmptyTitle>
                <EmptyDescription>
                  Crie uma campanha depois de configurar seu perfil organizador.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ))}

        {isFetchNextPageError ? (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Falha ao carregar mais campanhas</AlertTitle>
            <AlertDescription>Tente novamente para continuar a lista.</AlertDescription>
          </Alert>
        ) : null}

        {hasNextPage ? (
          <div className="flex justify-center">
            <Button
              variant="outline"
              disabled={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              {isFetchingNextPage ? 'Carregando campanhas...' : 'Carregar mais campanhas'}
            </Button>
          </div>
        ) : null}
      </div>
    </AppInset>
  );
}

type MyCampaign = Awaited<ReturnType<typeof rpc.campaign.myCampaigns.call>>['items'][number];

function MyCampaignCard({ campaign }: { campaign: MyCampaign }) {
  const status = useCampaignEffectiveStatus(campaign);

  return (
    <Card size="sm" className="min-h-28">
      <CardHeader className="min-h-12">
        <CardTitle className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
          <span className="line-clamp-2">{campaign.title}</span>
          <Badge variant={campaignStatusMetadata[status].variant}>
            {campaignStatusMetadata[status].label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span className="line-clamp-1">
            {campaign.category} · {campaign.region} ·{' '}
            {formatCampaignDate(campaign.startDate, 'dd MMM yyyy', { locale: ptBR })}
          </span>
          <span>
            {isPhysicalCampaign(campaign.type)
              ? `${campaign.participantCount} participantes · ${campaign.currentItems ?? 0}/${campaign.targetItems ?? 0} itens`
              : 'Campanha virtual'}
          </span>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<Link to="/campaigns/my/$id" params={{ id: campaign.id }} />}
        >
          Abrir painel
        </Button>
      </CardContent>
    </Card>
  );
}
