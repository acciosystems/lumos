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
import { rpc } from '@/lib/rpc';
import { formatCampaignDate } from '@/utils/campaign-date';

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
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge>{data.type === 'PHYSICAL' ? 'Campanha física' : 'Campanha virtual'}</Badge>
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
                value={data.type === 'PHYSICAL' ? String(data.participantCount) : 'Não aplicável'}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
              <Card className="gap-0">
                <CardHeader>
                  <CardTitle>Como doar</CardTitle>
                  <CardDescription>
                    {data.type === 'PHYSICAL'
                      ? 'Entregue os itens em um dos pontos de coleta cadastrados.'
                      : 'Contribua diretamente usando os dados de pagamento do organizador.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {data.type === 'PHYSICAL' ? (
                    <>
                      <div className="grid gap-3">
                        {data.collectionPoints.map((point) => (
                          <div key={point.id} className="rounded-md border p-3 text-sm">
                            <p className="font-medium">{point.name}</p>
                            <p className="text-muted-foreground">
                              {point.address}, {point.city} - {point.state}, {point.zipCode}
                            </p>
                            {point.instructions && <p className="mt-2">{point.instructions}</p>}
                          </div>
                        ))}
                      </div>
                    </>
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

              <Card className="gap-0">
                <CardHeader>
                  <CardTitle>Organizador</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
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

            <Card className="gap-0">
              <CardHeader>
                <CardTitle>Atualizações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {data.updates.length ? (
                  data.updates.map((update) => (
                    <div key={update.id} className="rounded-md border p-3">
                      <p className="text-sm">{update.message}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {format(update.publishedAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma atualização publicada.</p>
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
