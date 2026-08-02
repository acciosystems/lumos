import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ptBR } from 'date-fns/locale';

import { Loading } from '@/components/misc/loading';
import { AppInset } from '@/components/sidebar/inset';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { rpc } from '@/lib/rpc';
import { formatCampaignDate } from '@/utils/campaign-date';

export const Route = createFileRoute('/(app)/campaigns/my')({
  loader: () => ({
    breadcrumb: [{ label: 'Campanhas', href: '/campaigns' }, { label: 'Minhas campanhas' }],
  }),
  component: MyCampaignsPage,
});

function MyCampaignsPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['my-campaigns'],
    queryFn: async () => await rpc.campaign.myCampaigns.call(),
  });

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
          <Button render={<Link to="/campaigns/new" />}>
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
          (data.length ? (
            <div className="grid auto-rows-fr gap-3">
              {data.map((campaign) => (
                <Card key={campaign.id} size="sm" className="min-h-28">
                  <CardHeader className="min-h-12">
                    <CardTitle className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <span className="line-clamp-2">{campaign.title}</span>
                      <Badge variant="outline">{campaign.status}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="line-clamp-2 text-sm text-muted-foreground">
                      {campaign.category} · {campaign.region} ·{' '}
                      {formatCampaignDate(campaign.startDate, 'dd MMM yyyy', { locale: ptBR })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link to="/campaigns/$id" params={{ id: campaign.id }} />}
                    >
                      Ver campanha
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertTitle>Nenhuma campanha criada</AlertTitle>
              <AlertDescription>
                Crie uma campanha depois de configurar seu perfil organizador.
              </AlertDescription>
            </Alert>
          ))}
      </div>
    </AppInset>
  );
}
