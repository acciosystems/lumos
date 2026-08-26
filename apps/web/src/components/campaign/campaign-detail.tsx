import { formatCnpj } from '@lumos/validation/organizer';
import { IconCalendar, IconMapPin, IconUsers } from '@tabler/icons-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item';
import { rpc } from '@/lib/rpc';
import { formatCampaignDate } from '@/utils/campaign-date';
import { campaignTypeMetadata, isPhysicalCampaign } from '@/utils/campaign-type';

type CampaignDetailData =
  | Awaited<ReturnType<typeof rpc.campaign.publicById.call>>
  | Awaited<ReturnType<typeof rpc.campaign.byId.call>>;

export function CampaignDetail({
  campaign,
  action,
}: {
  campaign: CampaignDetailData;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge>{campaignTypeMetadata[campaign.type].campaignLabel}</Badge>
            <Badge variant="secondary">{campaign.category}</Badge>
            <Badge variant="outline">{campaign.region}</Badge>
          </div>
          <h1 className="font-heading text-3xl font-semibold">{campaign.title}</h1>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="grid auto-rows-fr gap-4 md:grid-cols-3">
        <InfoCard
          icon={<IconCalendar />}
          label="Período"
          value={`${formatCampaignDate(campaign.startDate, 'dd MMM yyyy', { locale: ptBR })} - ${formatCampaignDate(
            campaign.endDate,
            'dd MMM yyyy',
            { locale: ptBR },
          )}`}
        />
        <InfoCard icon={<IconMapPin />} label="Região" value={campaign.region} />
        <InfoCard
          icon={<IconUsers />}
          label="Participantes"
          value={
            isPhysicalCampaign(campaign.type) ? String(campaign.participantCount) : 'Não aplicável'
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Como doar</CardTitle>
            <CardDescription>
              {isPhysicalCampaign(campaign.type)
                ? 'Entregue os itens em um dos pontos de coleta cadastrados.'
                : 'Contribua diretamente usando os dados de pagamento do organizador.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {isPhysicalCampaign(campaign.type) ? (
              <>
                <div className="grid gap-3 text-sm">
                  {campaign.location && (
                    <DetailRow label="Local principal" value={campaign.location} />
                  )}
                  <DetailRow
                    label="Meta de itens"
                    value={`${campaign.currentItems ?? 0} de ${campaign.targetItems ?? 0} itens`}
                  />
                </div>
                <ItemGroup>
                  {campaign.collectionPoints.map((point) => (
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
              </>
            ) : (
              <div className="grid gap-3 text-sm">
                {campaign.pixKey && <DetailRow label="PIX" value={campaign.pixKey} />}
                {campaign.bankAccountInfo && (
                  <DetailRow label="Dados bancários" value={campaign.bankAccountInfo} />
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
            <DetailRow label="Nome" value={campaign.organizerProfile.displayName} />
            <DetailRow
              label="Tipo"
              value={
                campaign.organizerProfile.type === 'ORGANIZATION' ? 'Organização' : 'Pessoa física'
              }
            />
            {campaign.organizerProfile.cnpj && (
              <div className="grid gap-1">
                <span className="text-muted-foreground">CNPJ</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium wrap-break-word">
                    {formatCnpj(campaign.organizerProfile.cnpj)}
                  </span>
                  <Badge variant={campaign.organizerProfile.cnpjVerified ? 'default' : 'outline'}>
                    {campaign.organizerProfile.cnpjVerified
                      ? 'CNPJ verificado'
                      : 'CNPJ não verificado'}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atualizações</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {campaign.updates.length ? (
            <ItemGroup>
              {campaign.updates.map((update) => (
                <Item key={update.id} variant="outline" size="sm">
                  <ItemContent>
                    <ItemDescription className="line-clamp-none text-foreground">
                      {update.message}
                    </ItemDescription>
                    <ItemDescription className="text-xs">
                      {format(update.publishedAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
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
    </div>
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
