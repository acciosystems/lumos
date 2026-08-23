import { formatCnpj } from '@lumos/validation/organizer';
import { IconAlertCircle, IconCalendar, IconMapPin, IconUsers } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as v from 'valibot';

import { Loading } from '@/components/misc/loading';
import { AppInset } from '@/components/sidebar/inset';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item';
import { rpc } from '@/lib/rpc';
import { formatCampaignDate } from '@/utils/campaign-date';
import { campaignTypeMetadata, isPhysicalCampaign } from '@/utils/campaign-type';

const paramsSchema = v.object({
  id: v.pipe(v.string(), v.ulid()),
});

export const Route = createFileRoute('/(app)/campaigns/$id')({
  params: {
    parse: (params) => v.parse(paramsSchema, params),
  },
  loader: () => ({
    breadcrumb: [{ label: 'Campanhas', href: '/campaigns' }, { label: 'Detalhes' }],
  }),
  component: CampaignDetailPage,
});

function CampaignDetailPage() {
  const { id } = Route.useParams();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => await rpc.campaign.byId.call({ id }),
  });

  return (
    <AppInset breadcrumbs={[{ label: 'Campanhas', href: '/campaigns' }, { label: 'Detalhes' }]}>
      <div className="flex w-full flex-col gap-5">
        {isPending && <Loading description="Carregando campanha" />}

        {isError && (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Falha ao carregar campanha</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {data && (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <Badge>{campaignTypeMetadata[data.type].campaignLabel}</Badge>
                  <Badge variant="secondary">{data.category}</Badge>
                  <Badge variant="outline">{data.region}</Badge>
                </div>
                <h1 className="font-heading text-3xl font-semibold">{data.title}</h1>
                <p className="text-muted-foreground">{data.description}</p>
              </div>
            </div>

            <div className="grid auto-rows-fr gap-4 md:grid-cols-3">
              <InfoCard
                icon={<IconCalendar />}
                label="Período"
                value={`${formatCampaignDate(data.startDate, 'dd MMM yyyy', { locale: ptBR })} - ${formatCampaignDate(
                  data.endDate,
                  'dd MMM yyyy',
                  { locale: ptBR },
                )}`}
              />
              <InfoCard icon={<IconMapPin />} label="Região" value={data.region} />
              <InfoCard
                icon={<IconUsers />}
                label="Participantes"
                value={
                  isPhysicalCampaign(data.type) ? String(data.participantCount) : 'Não aplicável'
                }
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Como doar</CardTitle>
                  <CardDescription>
                    {isPhysicalCampaign(data.type)
                      ? 'Entregue os itens em um dos pontos de coleta cadastrados.'
                      : 'Contribua diretamente usando os dados de pagamento do organizador.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {isPhysicalCampaign(data.type) ? (
                    <ItemGroup>
                      {data.collectionPoints.map((point) => (
                        <Item key={point.id} variant="outline">
                          <ItemContent>
                            <ItemTitle>{point.name}</ItemTitle>
                            <ItemDescription>
                              {point.address}, {point.city} - {point.state}, {point.zipCode}
                            </ItemDescription>
                            {point.instructions && <p>{point.instructions}</p>}
                          </ItemContent>
                        </Item>
                      ))}
                    </ItemGroup>
                  ) : (
                    <div className="grid gap-3 text-sm">
                      {data.pixKey && <DetailRow label="PIX" value={data.pixKey} />}
                      {data.bankAccountInfo && (
                        <DetailRow label="Dados bancários" value={data.bankAccountInfo} />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organizador</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <DetailRow label="Nome" value={data.organizerProfile.displayName} />
                  <DetailRow
                    label="Tipo"
                    value={
                      data.organizerProfile.type === 'ORGANIZATION'
                        ? 'Organização'
                        : 'Pessoa física'
                    }
                  />
                  {data.organizerProfile.cnpj && (
                    <DetailRow label="CNPJ" value={formatCnpj(data.organizerProfile.cnpj)} />
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Atualizações</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {data.updates.length ? (
                  <ItemGroup>
                    {data.updates.map((update) => (
                      <Item key={update.id} variant="outline" size="sm">
                        <ItemContent>
                          <ItemDescription className="line-clamp-none text-foreground">
                            {update.message}
                          </ItemDescription>
                          <ItemDescription className="text-xs">
                            {format(update.publishedAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    ))}
                  </ItemGroup>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>Nenhuma atualização publicada</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppInset>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card size="sm" className="h-full min-h-24">
      <CardContent className="flex h-full items-center gap-3">
        <div className="[&_svg]:size-5">{icon}</div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="line-clamp-2 font-medium">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium wrap-break-word">{value}</span>
    </div>
  );
}
