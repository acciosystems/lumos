import { CampaignStatus } from '@lumos/validation/campaign';
import { formatCnpj } from '@lumos/validation/organizer';
import {
  IconCalendar,
  IconExternalLink,
  IconFile,
  IconMapPin,
  IconUsers,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { useCampaignEffectiveStatus } from '@/hooks/use-campaign-effective-status';
import { rpc } from '@/lib/rpc';
import { formatCampaignDate } from '@/utils/campaign-date';
import { campaignTypeMetadata, isPhysicalCampaign } from '@/utils/campaign-type';
import { formatFileSize } from '@/utils/file-size';

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
  const status = useCampaignEffectiveStatus(campaign);

  return (
    <div className="flex w-full flex-col gap-5">
      <CampaignHero campaign={campaign} />
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
        <CampaignAvailabilityCard campaign={campaign} status={status} />

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

      {campaign.accountability && (
        <CampaignAccountabilityReport
          campaignType={campaign.type}
          report={campaign.accountability}
        />
      )}

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

function CampaignAvailabilityCard({
  campaign,
  status,
}: {
  campaign: CampaignDetailData;
  status: CampaignStatus;
}) {
  const title =
    status === CampaignStatus.COMPLETED
      ? 'Campanha concluída'
      : status === CampaignStatus.PENDING
        ? 'Campanha agendada'
        : status === CampaignStatus.CANCELLED
          ? 'Campanha cancelada'
          : 'Como doar';
  const description = getCampaignAvailabilityDescription(campaign, status);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {status === CampaignStatus.COMPLETED ? (
          <p className="text-sm text-muted-foreground">
            Não são aceitas novas doações para esta campanha.
          </p>
        ) : status !== CampaignStatus.ACTIVE ? (
          <p className="text-sm text-muted-foreground">
            Consulte o período da campanha acima para acompanhar sua disponibilidade.
          </p>
        ) : isPhysicalCampaign(campaign.type) ? (
          <PhysicalCampaignAvailability campaign={campaign} />
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
  );
}

function getCampaignAvailabilityDescription(campaign: CampaignDetailData, status: CampaignStatus) {
  if (status === CampaignStatus.COMPLETED) {
    return campaign.accountability
      ? 'Esta campanha foi encerrada. Consulte abaixo a prestação de contas publicada.'
      : 'Esta campanha foi encerrada. A prestação de contas ainda não foi publicada.';
  }
  if (status === CampaignStatus.PENDING) {
    return 'As doações e participações estarão disponíveis a partir da data inicial.';
  }
  if (status === CampaignStatus.CANCELLED) {
    return 'Esta campanha não está mais aceitando doações ou participações.';
  }
  return isPhysicalCampaign(campaign.type)
    ? 'Entregue os itens em um dos pontos de coleta cadastrados.'
    : 'Contribua diretamente usando os dados de pagamento do organizador.';
}

function PhysicalCampaignAvailability({ campaign }: { campaign: CampaignDetailData }) {
  return (
    <>
      <div className="grid gap-3 text-sm">
        {campaign.location && <DetailRow label="Local principal" value={campaign.location} />}
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
  );
}

function CampaignHero({ campaign }: { campaign: CampaignDetailData }) {
  if (!campaign.image) return null;
  return (
    <div className="aspect-16/7 overflow-hidden rounded-xl border bg-muted">
      <img
        src={campaign.image.url}
        alt={`Imagem da campanha ${campaign.title}`}
        className="size-full object-cover"
        decoding="async"
      />
    </div>
  );
}

function CampaignAccountabilityReport({
  campaignType,
  report,
}: {
  campaignType: CampaignDetailData['type'];
  report: NonNullable<CampaignDetailData['accountability']>;
}) {
  const total = isPhysicalCampaign(campaignType)
    ? `${report.totalItems ?? 0} itens coletados`
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
        (report.totalAmountCents ?? 0) / 100,
      );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prestação de contas</CardTitle>
        <CardDescription>Resultado informado pelo organizador após o encerramento.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <DetailRow
          label={isPhysicalCampaign(campaignType) ? 'Total de itens' : 'Total arrecadado'}
          value={total}
        />
        <div className="grid gap-1">
          <span className="text-muted-foreground">Resumo do resultado</span>
          <p className="font-medium whitespace-pre-wrap">{report.outcomeSummary}</p>
        </div>
        {report.evidenceAssets.length > 0 && (
          <div className="grid gap-2">
            <span className="text-muted-foreground">Evidências públicas</span>
            <ItemGroup>
              {report.evidenceAssets.map((asset) => (
                <Item
                  key={asset.id}
                  variant="outline"
                  size="sm"
                  render={
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir evidência ${asset.name}`}
                    />
                  }
                >
                  <ItemMedia variant={asset.contentType.startsWith('image/') ? 'image' : 'icon'}>
                    {asset.contentType.startsWith('image/') ? (
                      <img src={asset.url} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <IconFile />
                    )}
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="wrap-break-word">{asset.name}</ItemTitle>
                    <ItemDescription>
                      {asset.contentType === 'application/pdf' ? 'Documento PDF' : 'Imagem'} ·{' '}
                      {formatFileSize(asset.contentLength)}
                    </ItemDescription>
                  </ItemContent>
                  <IconExternalLink className="size-4 shrink-0" />
                </Item>
              ))}
            </ItemGroup>
          </div>
        )}
      </CardContent>
    </Card>
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
