import { CampaignType, campaignTypeSchema } from '@lumos/validation/campaign';
import { IconAlertCircle, IconFilter, IconPlus, IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ptBR } from 'date-fns/locale';
import { useCallback } from 'react';
import * as v from 'valibot';

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
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebouncedRouteInput } from '@/hooks/use-debounced-route-input';
import { rpc } from '@/lib/rpc';
import { formatCampaignDate } from '@/utils/campaign-date';
import {
  campaignTypeMetadata,
  campaignTypeValues,
  isPhysicalCampaign,
} from '@/utils/campaign-type';

const searchSchema = v.object({
  category: v.optional(v.string()),
  region: v.optional(v.string()),
  type: v.optional(campaignTypeSchema),
});

const ALL_CAMPAIGN_TYPES = 'ALL' as const;
type CampaignFilterType = CampaignType | typeof ALL_CAMPAIGN_TYPES;
type TextFilterName = 'category' | 'region';

export const Route = createFileRoute('/(app)/campaigns/')({
  loader: () => ({ breadcrumb: [{ label: 'Campanhas' }] }),
  validateSearch: searchSchema,
  component: CampaignsPage,
});

function CampaignsPage() {
  const { category, region, type } = Route.useSearch();
  const navigate = Route.useNavigate();
  const selectedType: CampaignFilterType = type ?? ALL_CAMPAIGN_TYPES;
  const updateFilter = useCallback(
    (name: TextFilterName, value: string) =>
      navigate({
        replace: true,
        search: (previous) => ({ ...previous, [name]: value || undefined }),
      }),
    [navigate],
  );
  const [categoryInput, setCategoryInput] = useDebouncedRouteInput({
    name: 'category',
    value: category,
    onCommit: updateFilter,
  });
  const [regionInput, setRegionInput] = useDebouncedRouteInput({
    name: 'region',
    value: region,
    onCommit: updateFilter,
  });

  const filters = {
    category,
    region,
    type,
  };

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['campaigns', filters],
    queryFn: async () => await rpc.campaign.list.call(filters),
  });

  return (
    <AppInset breadcrumbs={[{ label: 'Campanhas' }]}>
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold">Campanhas</h1>
            <p className="text-sm text-muted-foreground">
              Encontre campanhas de doação por tipo, tema e região.
            </p>
          </div>
          <Button render={<Link to="/campaigns/new" />}>
            <IconPlus /> Criar campanha
          </Button>
        </div>

        <Card size="sm">
          <CardContent className="grid gap-3 md:grid-cols-[1fr_1fr_180px]">
            <Field>
              <FieldLabel htmlFor="category">
                <IconSearch className="size-4" /> Tema
              </FieldLabel>
              <Input
                id="category"
                value={categoryInput}
                onChange={(event) => setCategoryInput(event.target.value)}
                placeholder="Ex: alimentos, roupas"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="region">
                <IconFilter className="size-4" /> Região
              </FieldLabel>
              <Input
                id="region"
                value={regionInput}
                onChange={(event) => setRegionInput(event.target.value)}
                placeholder="Ex: São Paulo"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="type">Tipo</FieldLabel>
              <Select
                value={selectedType}
                onValueChange={(value) =>
                  navigate({
                    search: (previous) => ({
                      ...previous,
                      type:
                        value === ALL_CAMPAIGN_TYPES
                          ? undefined
                          : v.parse(campaignTypeSchema, value),
                    }),
                  })
                }
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue>
                    {selectedType === ALL_CAMPAIGN_TYPES
                      ? 'Todos'
                      : campaignTypeMetadata[selectedType].label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CAMPAIGN_TYPES}>Todos</SelectItem>
                  {campaignTypeValues.map((campaignType) => (
                    <SelectItem key={campaignType} value={campaignType}>
                      {campaignTypeMetadata[campaignType].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        {isPending && <Loading description="Carregando campanhas" />}

        {isError && (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Falha ao carregar campanhas</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.length ? (
              data.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)
            ) : (
              <Empty className="md:col-span-2 xl:col-span-3">
                <EmptyHeader>
                  <EmptyTitle>Nenhuma campanha encontrada</EmptyTitle>
                  <EmptyDescription>Ajuste os filtros para ver outras campanhas.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        )}
      </div>
    </AppInset>
  );
}

function CampaignCard({
  campaign,
}: {
  campaign: Awaited<ReturnType<typeof rpc.campaign.list.call>>[number];
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
        <CardDescription>{campaign.organizerProfile.displayName}</CardDescription>
        <CardAction>
          <Badge variant={isPhysicalCampaign(campaign.type) ? 'default' : 'secondary'}>
            {campaignTypeMetadata[campaign.type].label}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">{campaign.description}</p>
        <div className="grid gap-2 text-sm">
          <Metadata label="Tema" value={campaign.category} />
          <Metadata label="Região" value={campaign.region} />
          <Metadata
            label="Período"
            value={`${formatCampaignDate(campaign.startDate, 'dd MMM', { locale: ptBR })} - ${formatCampaignDate(
              campaign.endDate,
              'dd MMM yyyy',
              { locale: ptBR },
            )}`}
          />
          <Metadata
            label="Participantes"
            value={isPhysicalCampaign(campaign.type) ? String(campaign.participantCount) : 'N/A'}
          />
        </div>
        <Button
          className="mt-auto"
          variant="outline"
          render={<Link to="/campaigns/$id" params={{ id: campaign.id }} />}
        >
          Ver campanha
        </Button>
      </CardContent>
    </Card>
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
