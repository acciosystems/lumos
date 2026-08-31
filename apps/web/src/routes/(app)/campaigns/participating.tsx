import { IconAlertCircle } from '@tabler/icons-react';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ptBR } from 'date-fns/locale';

import { Loading } from '@/components/misc/loading';
import { AppInset } from '@/components/sidebar/inset';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { myParticipationsInfiniteOptions } from '@/lib/queries/campaign';
import { formatCampaignDate } from '@/utils/campaign-date';
import { getMillisecondsUntilNextCampaignDay } from '@/utils/campaign-status';

export const Route = createFileRoute('/(app)/campaigns/participating')({
  loader: ({ context }) =>
    context.queryClient.ensureInfiniteQueryData(myParticipationsInfiniteOptions()),
  head: () => ({
    meta: [{ title: 'Minhas participações | Nossa Causa' }],
  }),
  pendingComponent: () => (
    <AppInset
      breadcrumbs={[{ label: 'Campanhas', href: '/campaigns' }, { label: 'Minhas participações' }]}
    >
      <Loading description="Carregando suas participações" />
    </AppInset>
  ),
  component: ParticipatingCampaignsPage,
});

function ParticipatingCampaignsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      ...myParticipationsInfiniteOptions(),
      refetchInterval: () => getMillisecondsUntilNextCampaignDay(),
      refetchOnWindowFocus: 'always',
    });
  const campaigns = data.pages.flatMap((page) => page.items);

  return (
    <AppInset
      breadcrumbs={[{ label: 'Campanhas', href: '/campaigns' }, { label: 'Minhas participações' }]}
    >
      <div className="flex w-full flex-col gap-5">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Minhas participações</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe as campanhas físicas das quais você está participando.
          </p>
        </div>

        {campaigns.length ? (
          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="h-full">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                  <CardDescription>{campaign.organizerProfile.displayName}</CardDescription>
                  <CardAction>
                    <Badge>{campaign.category}</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {campaign.description}
                  </p>
                  <div className="grid gap-2 text-sm">
                    <Metadata label="Região" value={campaign.region} />
                    <Metadata
                      label="Período"
                      value={`${formatCampaignDate(campaign.startDate, 'dd MMM', { locale: ptBR })} - ${formatCampaignDate(
                        campaign.endDate,
                        'dd MMM yyyy',
                        { locale: ptBR },
                      )}`}
                    />
                    <Metadata label="Participantes" value={String(campaign.participantCount)} />
                  </div>
                  <Button
                    nativeButton={false}
                    className="mt-auto"
                    variant="outline"
                    render={<Link to="/campaigns/$id" params={{ id: campaign.id }} />}
                  >
                    Ver campanha
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Nenhuma participação ativa</EmptyTitle>
              <EmptyDescription>
                Explore as campanhas físicas e participe de uma causa para acompanhá-la aqui.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button nativeButton={false} variant="outline" render={<Link to="/campaigns" />}>
                Explorar campanhas
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {isFetchNextPageError ? (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Falha ao carregar mais participações</AlertTitle>
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
              {isFetchingNextPage ? 'Carregando participações...' : 'Carregar mais participações'}
            </Button>
          </div>
        ) : null}
      </div>
    </AppInset>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
