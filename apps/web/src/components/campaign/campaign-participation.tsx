import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AuthGuard } from '@/lib/auth/guard';
import { rpc } from '@/lib/rpc';

export function CampaignParticipation({ campaignId }: { campaignId: string }) {
  return (
    <>
      <AuthGuard when="loading">
        <ParticipationLoading />
      </AuthGuard>

      <AuthGuard when="unauthenticated">
        <Button nativeButton={false} render={<Link to="/sign-in" />}>
          Entrar para participar
        </Button>
      </AuthGuard>

      <AuthGuard when="authenticated">
        {({ user }) => (
          <AuthenticatedCampaignParticipation campaignId={campaignId} viewerId={user.id} />
        )}
      </AuthGuard>
    </>
  );
}

function AuthenticatedCampaignParticipation({
  campaignId,
  viewerId,
}: {
  campaignId: string;
  viewerId: string;
}) {
  const queryClient = useQueryClient();
  const [isCancelOpen, setCancelOpen] = useState(false);

  const participationOptions = rpc.campaign.participationState.queryOptions({
    input: { id: campaignId },
  });
  const participationQuery = useQuery({
    ...participationOptions,
    queryKey: [...participationOptions.queryKey, { viewerId }],
  });

  const invalidateCampaignQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: rpc.campaign.publicById.key({ input: { id: campaignId } }),
      }),
      queryClient.invalidateQueries({ queryKey: rpc.campaign.list.key() }),
      queryClient.invalidateQueries({
        queryKey: rpc.campaign.byId.key({ input: { id: campaignId } }),
      }),
      queryClient.invalidateQueries({ queryKey: rpc.campaign.myCampaigns.key() }),
      queryClient.invalidateQueries({ queryKey: rpc.campaign.myParticipations.key() }),
      queryClient.invalidateQueries({
        queryKey: rpc.campaign.participationState.key({ input: { id: campaignId } }),
      }),
    ]);
  };

  const joinMutation = useMutation(
    rpc.campaign.join.mutationOptions({
      onSuccess: async () => {
        await invalidateCampaignQueries();
        toast.success('Participação confirmada.');
      },
      onError: (error) =>
        toast.error('Não foi possível confirmar sua participação.', {
          description: error.message,
        }),
    }),
  );

  const cancelMutation = useMutation(
    rpc.campaign.cancelParticipation.mutationOptions({
      onSuccess: async () => {
        await invalidateCampaignQueries();
        setCancelOpen(false);
        toast.success('Participação cancelada.');
      },
      onError: (error) =>
        toast.error('Não foi possível cancelar sua participação.', {
          description: error.message,
        }),
    }),
  );

  if (participationQuery.isPending) return <ParticipationLoading />;

  if (participationQuery.isError) {
    return <Button disabled>Participação indisponível</Button>;
  }

  return participationQuery.data.isParticipating ? (
    <>
      <Button variant="outline" onClick={() => setCancelOpen(true)}>
        Cancelar participação
      </Button>
      <AlertDialog
        open={isCancelOpen}
        onOpenChange={(open) => {
          if (!open && cancelMutation.isPending) return;
          setCancelOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar participação?</AlertDialogTitle>
            <AlertDialogDescription>
              Seu compromisso deixará de ser contado nesta campanha. Você poderá participar
              novamente enquanto ela estiver ativa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelMutation.isPending}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={() => cancelMutation.mutate({ id: campaignId })}
            >
              {cancelMutation.isPending && <Spinner />}
              Confirmar cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  ) : (
    <Button
      disabled={joinMutation.isPending}
      onClick={() => joinMutation.mutate({ id: campaignId })}
    >
      {joinMutation.isPending && <Spinner />}
      Participar desta campanha
    </Button>
  );
}

function ParticipationLoading() {
  return (
    <Button disabled>
      <Spinner />
      Carregando participação
    </Button>
  );
}
