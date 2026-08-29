import {
  CampaignStatus,
  CAMPAIGN_EVIDENCE_MAX_COUNT,
  campaignAccountabilityInputSchema,
  formatBrlCents,
  parseBrlAmountToCents,
} from '@lumos/validation/campaign';
import { IconDeviceFloppy, IconFile, IconPhoto, IconTrash } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { CampaignAssetUploadField } from '@/components/campaign/campaign-asset-upload-field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useCampaignAssetUploads } from '@/hooks/use-campaign-asset-uploads';
import { invalidateCampaignManagement } from '@/lib/queries/campaign';
import { rpc } from '@/lib/rpc';
import { isPhysicalCampaign } from '@/utils/campaign-type';
import { formatFileSize } from '@/utils/file-size';

type OwnerCampaign = Awaited<ReturnType<typeof rpc.campaign.byId.call>>;

export function CampaignAccountabilityForm({ campaign }: { campaign: OwnerCampaign }) {
  const queryClient = useQueryClient();
  const isPhysical = isPhysicalCampaign(campaign.type);
  const accountability = campaign.accountability;
  const isCorrection = Boolean(accountability);
  const deadline = campaign.accountabilityDeadline
    ? new Date(campaign.accountabilityDeadline)
    : null;
  const [retainedEvidenceAssetIds, setRetainedEvidenceAssetIds] = useState(
    () => accountability?.evidenceAssets.map((asset) => asset.id) ?? [],
  );
  const evidenceUpload = useCampaignAssetUploads({
    kind: 'ACCOUNTABILITY_EVIDENCE',
    campaignId: campaign.id,
    maxCount: CAMPAIGN_EVIDENCE_MAX_COUNT - retainedEvidenceAssetIds.length,
  });
  const form = useForm({
    defaultValues: {
      totalItems: accountability?.totalItems ?? 0,
      totalAmountBrl:
        accountability?.totalAmountCents === null || accountability?.totalAmountCents === undefined
          ? ''
          : formatBrlCents(accountability.totalAmountCents),
      outcomeSummary: accountability?.outcomeSummary ?? '',
      retainedEvidenceAssetIds,
      evidenceUploadIds: [] as string[],
    },
    onSubmit: ({ value }) => {
      const totalAmountCents = parseBrlAmountToCents(value.totalAmountBrl);
      const draft = isPhysical
        ? {
            id: campaign.id,
            type: 'PHYSICAL' as const,
            totalItems: value.totalItems,
            outcomeSummary: value.outcomeSummary,
            retainedEvidenceAssetIds,
            evidenceUploadIds: evidenceUpload.readyUploadIds,
          }
        : {
            id: campaign.id,
            type: 'VIRTUAL' as const,
            totalAmountCents: totalAmountCents ?? Number.NaN,
            outcomeSummary: value.outcomeSummary,
            retainedEvidenceAssetIds,
            evidenceUploadIds: evidenceUpload.readyUploadIds,
          };
      const result = v.safeParse(campaignAccountabilityInputSchema, draft);

      if (!result.success) {
        toast.error(result.issues[0]?.message ?? 'Revise os dados da prestação de contas.');
        return;
      }

      mutation.mutate(result.output);
    },
  });

  const mutation = useMutation(
    rpc.campaign.saveAccountability.mutationOptions({
      onSuccess: async () => {
        evidenceUpload.releaseAssets();
        await invalidateCampaignManagement(queryClient, campaign.id);
        toast.success(
          isCorrection
            ? 'Prestação de contas corrigida.'
            : 'Prestação de contas enviada com sucesso.',
        );
      },
      onError: (error) => {
        evidenceUpload.markReadyAssetsFailed(
          'Verifique o arquivo e tente enviá-lo novamente antes de salvar.',
        );
        toast.error('Não foi possível salvar a prestação de contas.', {
          description: error.message,
        });
      },
    }),
  );

  if (campaign.status !== CampaignStatus.COMPLETED) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prestação de contas</CardTitle>
        <CardDescription>
          {isCorrection
            ? 'Atualize os resultados e as evidências. A data e o resultado original do prazo serão preservados.'
            : 'Informe o resultado da campanha e publique um resumo para os doadores.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <AccountabilityStatus campaign={campaign} deadline={deadline} />

        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          {isPhysical ? (
            <form.Field name="totalItems">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="accountability-total-items">Total de itens</FieldLabel>
                  <Input
                    id="accountability-total-items"
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={field.state.value}
                    disabled={mutation.isPending}
                    onChange={(event) => field.setValue(Number(event.target.value))}
                  />
                  <FieldDescription>Informe o total acumulado de itens coletados.</FieldDescription>
                </Field>
              )}
            </form.Field>
          ) : (
            <form.Field name="totalAmountBrl">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="accountability-total-amount">
                    Total arrecadado (R$)
                  </FieldLabel>
                  <Input
                    id="accountability-total-amount"
                    inputMode="decimal"
                    placeholder="0,00"
                    required
                    value={field.state.value}
                    disabled={mutation.isPending}
                    onChange={(event) => field.setValue(event.target.value)}
                  />
                  <FieldDescription>
                    O valor é registrado em centavos e não é processado pela Lumos.
                  </FieldDescription>
                </Field>
              )}
            </form.Field>
          )}

          <form.Field name="outcomeSummary">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="accountability-outcome-summary">
                  Resumo do resultado
                </FieldLabel>
                <Textarea
                  id="accountability-outcome-summary"
                  required
                  value={field.state.value}
                  disabled={mutation.isPending}
                  placeholder="Conte como as doações foram utilizadas e quem foi beneficiado."
                  onChange={(event) => field.setValue(event.target.value)}
                />
                <FieldDescription>Este texto será exibido publicamente.</FieldDescription>
              </Field>
            )}
          </form.Field>

          {accountability?.evidenceAssets.length ? (
            <Field>
              <FieldLabel>Evidências publicadas</FieldLabel>
              <ItemGroup>
                {accountability.evidenceAssets
                  .filter((asset) => retainedEvidenceAssetIds.includes(asset.id))
                  .map((asset) => (
                    <Item key={asset.id} variant="outline" size="sm">
                      <ItemMedia variant="icon">
                        {asset.contentType.startsWith('image/') ? <IconPhoto /> : <IconFile />}
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{asset.name}</ItemTitle>
                        <ItemDescription>
                          {formatFileSize(asset.contentLength)} · Publicada
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          aria-label={`Remover ${asset.name}`}
                          disabled={mutation.isPending}
                          onClick={() =>
                            setRetainedEvidenceAssetIds((current) =>
                              current.filter((assetId) => assetId !== asset.id),
                            )
                          }
                        >
                          <IconTrash />
                        </Button>
                      </ItemActions>
                    </Item>
                  ))}
              </ItemGroup>
              <FieldDescription>
                Arquivos removidos deixarão de ser exibidos depois que a correção for salva.
              </FieldDescription>
            </Field>
          ) : null}

          <CampaignAssetUploadField
            id="accountability-evidence"
            label="Novas evidências"
            description="Opcional. Envie até 10 imagens ou PDFs de no máximo 10 MB cada."
            kind="ACCOUNTABILITY_EVIDENCE"
            assets={evidenceUpload.assets}
            maxCount={CAMPAIGN_EVIDENCE_MAX_COUNT - retainedEvidenceAssetIds.length}
            disabled={mutation.isPending}
            onFiles={evidenceUpload.addFiles}
            onRemove={(key) => void evidenceUpload.removeAsset(key)}
            onRetry={(key) => void evidenceUpload.retryAsset(key)}
          />

          <Button
            type="submit"
            className="self-start"
            disabled={mutation.isPending || evidenceUpload.isBusy || evidenceUpload.hasErrors}
          >
            {mutation.isPending ? <Spinner /> : <IconDeviceFloppy />}
            {mutation.isPending
              ? 'Salvando...'
              : isCorrection
                ? 'Salvar correção'
                : 'Enviar prestação'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AccountabilityStatus({
  campaign,
  deadline,
}: {
  campaign: OwnerCampaign;
  deadline: Date | null;
}) {
  const status = campaign.accountabilityStatus;
  const messages = {
    OUTSTANDING: {
      title: 'Prestação pendente',
      description: deadline
        ? `Envie até ${formatDeadline(deadline)}.`
        : 'Envie a prestação de contas para concluir esta etapa.',
      variant: 'default' as const,
    },
    OVERDUE: {
      title: 'Prestação em atraso',
      description:
        'O prazo passou, mas o envio continua disponível e ficará marcado como atrasado.',
      variant: 'destructive' as const,
    },
    SUBMITTED_ON_TIME: {
      title: 'Enviada dentro do prazo',
      description: 'O resultado original de pontualidade será preservado nas correções.',
      variant: 'default' as const,
    },
    SUBMITTED_LATE: {
      title: 'Enviada em atraso',
      description: 'O resultado original de pontualidade será preservado nas correções.',
      variant: 'destructive' as const,
    },
    NOT_REQUIRED: {
      title: 'Prestação indisponível',
      description: 'A prestação só pode ser enviada para campanhas concluídas.',
      variant: 'default' as const,
    },
  }[status];

  return (
    <Alert variant={messages.variant}>
      <AlertTitle>{messages.title}</AlertTitle>
      <AlertDescription>{messages.description}</AlertDescription>
    </Alert>
  );
}

function formatDeadline(value: Date) {
  return `${new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(value)} (horário de São Paulo)`;
}
