import {
  CampaignStatus,
  type CampaignProgressUpdateInput,
  type CampaignPublishUpdateInput,
} from '@lumos/validation/campaign';
import { IconCircleCheck, IconCircleX, IconEdit, IconSend, IconUsers } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CampaignAccountabilityForm } from '@/components/campaign/campaign-accountability-form';
import { CampaignDetail } from '@/components/campaign/campaign-detail';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Progress, ProgressLabel } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useCampaignEffectiveStatus } from '@/hooks/use-campaign-effective-status';
import { useOperationKey } from '@/hooks/use-operation-key';
import { invalidateCampaignManagement } from '@/lib/queries/campaign';
import { rpc } from '@/lib/rpc';
import { campaignStatusMetadata } from '@/utils/campaign-status';
import { isPhysicalCampaign } from '@/utils/campaign-type';

type OwnerCampaign = Awaited<ReturnType<typeof rpc.campaign.byId.call>>;

export function CampaignDashboard({ campaign }: { campaign: OwnerCampaign }) {
  const queryClient = useQueryClient();
  const [currentItems, setCurrentItems] = useState(String(campaign.currentItems ?? 0));
  const status = useCampaignEffectiveStatus(campaign);
  const isActive = status === CampaignStatus.ACTIVE;
  const canEdit = ([CampaignStatus.PENDING, CampaignStatus.ACTIVE] as CampaignStatus[]).includes(
    status,
  );
  const isPhysical = isPhysicalCampaign(campaign.type);
  const targetItems = campaign.targetItems ?? 0;
  const progressPercentage =
    targetItems > 0 ? ((campaign.currentItems ?? 0) / targetItems) * 100 : 0;
  const terminalAt = campaign.completedAt ?? campaign.cancelledAt;

  useEffect(() => {
    setCurrentItems(String(campaign.currentItems ?? 0));
  }, [campaign.currentItems, campaign.id]);

  useEffect(() => {
    if (status === campaign.status) return;
    void invalidateCampaignManagement(queryClient, campaign.id).catch(() => undefined);
  }, [campaign.id, campaign.status, queryClient, status]);

  const invalidate = async () => await invalidateCampaignManagement(queryClient, campaign.id);

  const progressMutation = useMutation(
    rpc.campaign.updateProgress.mutationOptions({
      onSuccess: async () => {
        await invalidate();
        toast.success('Progresso da campanha atualizado.');
      },
      onError: (error) =>
        toast.error('Não foi possível atualizar o progresso.', { description: error.message }),
    }),
  );

  const submitProgress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    progressMutation.mutate({
      id: campaign.id,
      currentItems: Number(currentItems),
    } satisfies CampaignProgressUpdateInput);
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <section className="flex flex-col gap-4" aria-labelledby="campaign-management-title">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="campaign-management-title" className="font-heading text-2xl font-semibold">
              Painel de controle
            </h2>
            <p className="text-sm text-muted-foreground">
              Acompanhe a participação, o progresso e o ciclo de vida da sua campanha.
            </p>
          </div>
          {canEdit && (
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link to="/campaigns/my/$id/edit" params={{ id: campaign.id }} />}
            >
              <IconEdit /> Editar detalhes
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Estado atual da campanha.</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant={campaignStatusMetadata[status].variant}>
                {campaignStatusMetadata[status].label}
              </Badge>
              {terminalAt && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Registrada em {formatCampaignDateTime(terminalAt)}.
                </p>
              )}
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Participantes</CardTitle>
              <CardDescription>
                {isPhysical
                  ? 'Participações ativas na campanha.'
                  : 'Campanhas virtuais não registram participações.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-2xl font-semibold">
              <IconUsers className="size-5" />
              {isPhysical ? campaign.participantCount : 'Não aplicável'}
            </CardContent>
          </Card>
        </div>

        {isPhysical && (
          <Card>
            <CardHeader>
              <CardTitle>Progresso de itens</CardTitle>
              <CardDescription>
                Registre os itens recebidos. A contagem pode ultrapassar a meta.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <Progress value={Math.min(progressPercentage, 100)}>
                <ProgressLabel>
                  {campaign.currentItems ?? 0} de {targetItems} itens
                </ProgressLabel>
                <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                  {Math.round(progressPercentage)}%
                </span>
              </Progress>

              <form
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
                onSubmit={submitProgress}
              >
                <Field>
                  <FieldLabel htmlFor="current-items">Itens recebidos</FieldLabel>
                  <Input
                    id="current-items"
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={currentItems}
                    disabled={!isActive || progressMutation.isPending}
                    onChange={(event) => setCurrentItems(event.target.value)}
                  />
                  <CampaignProgressDescription status={status} />
                </Field>
                <Button type="submit" disabled={!isActive || progressMutation.isPending}>
                  {progressMutation.isPending && <Spinner />}
                  Salvar progresso
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {campaign.status === CampaignStatus.COMPLETED && (
          <CampaignAccountabilityForm
            key={campaign.accountability?.updatedAt?.toString() ?? 'new-accountability'}
            campaign={campaign}
          />
        )}

        <CampaignLifecycleControls campaign={campaign} status={status} />
        {isActive && <CampaignUpdateComposer campaignId={campaign.id} />}
      </section>

      <section
        className="flex flex-col gap-4 border-t pt-6"
        aria-labelledby="campaign-current-preview-title"
      >
        <div>
          <h2 id="campaign-current-preview-title" className="font-heading text-2xl font-semibold">
            Visualização pública atual
          </h2>
          <p className="text-sm text-muted-foreground">
            É assim que a campanha aparece para os doadores.
          </p>
        </div>
        <CampaignDetail
          campaign={campaign}
          action={
            <Badge variant={campaignStatusMetadata[status].variant}>
              {campaignStatusMetadata[status].label}
            </Badge>
          }
        />
      </section>
    </div>
  );
}

function formatCampaignDateTime(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'long',
  }).format(value);
}

function CampaignProgressDescription({ status }: { status: CampaignStatus }) {
  return (
    <FieldDescription>
      {status === CampaignStatus.ACTIVE
        ? 'Informe o total acumulado de itens recebidos.'
        : status === CampaignStatus.PENDING
          ? 'O progresso poderá ser atualizado quando a campanha começar.'
          : 'O progresso não pode mais ser atualizado.'}
    </FieldDescription>
  );
}

function CampaignUpdateComposer({ campaignId }: { campaignId: string }) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const operationKey = useOperationKey();
  const mutation = useMutation(
    rpc.campaign.publishUpdate.mutationOptions({
      onSuccess: async () => {
        await invalidateCampaignManagement(queryClient, campaignId);
        setMessage('');
        operationKey.reset();
        toast.success('Atualização publicada.');
      },
      onError: (error) =>
        toast.error('Não foi possível publicar a atualização.', { description: error.message }),
    }),
  );

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = { id: campaignId, message: message.trim() };
    if (payload.message) {
      mutation.mutate({
        ...payload,
        operationKey: operationKey.getKey(payload),
      } satisfies CampaignPublishUpdateInput);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publicar atualização</CardTitle>
        <CardDescription>
          Compartilhe mudanças de local, horário ou outras informações importantes com os doadores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3" onSubmit={submit}>
          <Field>
            <FieldLabel htmlFor="campaign-update-message">Mensagem</FieldLabel>
            <Textarea
              id="campaign-update-message"
              value={message}
              maxLength={2000}
              placeholder="Informe uma novidade sobre a campanha"
              disabled={mutation.isPending}
              onChange={(event) => setMessage(event.target.value)}
            />
            <FieldDescription>{message.length}/2.000 caracteres</FieldDescription>
          </Field>
          <Button
            type="submit"
            className="self-start"
            disabled={!message.trim() || mutation.isPending}
          >
            {mutation.isPending ? <Spinner /> : <IconSend />}
            {mutation.isPending ? 'Publicando...' : 'Publicar atualização'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CampaignLifecycleControls({
  campaign,
  status,
}: {
  campaign: OwnerCampaign;
  status: CampaignStatus;
}) {
  const queryClient = useQueryClient();
  const [transitionStatus, setTransitionStatus] = useState<TerminalStatus | null>(null);
  const isActive = status === CampaignStatus.ACTIVE;
  const canCancel = status === CampaignStatus.PENDING || isActive;

  const lifecycleMutation = useMutation(
    rpc.campaign.transitionLifecycle.mutationOptions({
      onSuccess: async (result) => {
        await invalidateCampaignManagement(queryClient, campaign.id);
        setTransitionStatus(null);
        toast.success(
          result.status === CampaignStatus.COMPLETED
            ? 'Campanha concluída.'
            : 'Campanha cancelada.',
        );
      },
      onError: (error) =>
        toast.error('Não foi possível alterar a campanha.', { description: error.message }),
    }),
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ciclo de vida</CardTitle>
          <CardDescription>
            {status === CampaignStatus.PENDING
              ? 'A campanha está agendada. Cancele-a se ela não puder ser realizada.'
              : isActive
                ? 'Conclua a campanha quando a coleta terminar ou cancele-a se ela não puder continuar.'
                : 'Campanhas concluídas ou canceladas não podem ser reabertas.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            disabled={!isActive || lifecycleMutation.isPending}
            onClick={() => setTransitionStatus(CampaignStatus.COMPLETED)}
          >
            <IconCircleCheck /> Concluir campanha
          </Button>
          <Button
            variant="destructive"
            disabled={!canCancel || lifecycleMutation.isPending}
            onClick={() => setTransitionStatus(CampaignStatus.CANCELLED)}
          >
            <IconCircleX /> Cancelar campanha
          </Button>
        </CardContent>
      </Card>

      <AlertDialog
        open={transitionStatus !== null}
        onOpenChange={(open) => {
          if (!open && !lifecycleMutation.isPending) setTransitionStatus(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {transitionStatus === CampaignStatus.COMPLETED
                ? 'Concluir esta campanha?'
                : 'Cancelar esta campanha?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {transitionStatus === CampaignStatus.COMPLETED
                ? 'A campanha deixará de aceitar novas participações e ficará pronta para a prestação de contas.'
                : 'A campanha deixará de aparecer nas campanhas ativas e não aceitará novas participações.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={lifecycleMutation.isPending}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              variant={transitionStatus === CampaignStatus.CANCELLED ? 'destructive' : 'default'}
              disabled={lifecycleMutation.isPending || transitionStatus === null}
              onClick={() => {
                if (transitionStatus) {
                  lifecycleMutation.mutate({ id: campaign.id, status: transitionStatus });
                }
              }}
            >
              {lifecycleMutation.isPending && <Spinner />}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

type TerminalStatus = 'COMPLETED' | 'CANCELLED';
