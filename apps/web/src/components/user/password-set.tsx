import { authClient } from '@lumos/auth/auth-client';
import { IconPlus } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useStrictAuth } from '@/lib/auth/hooks';

export function UserPasswordSet() {
  const { user } = useStrictAuth();

  const [isOpen, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () =>
      await authClient.requestPasswordReset({ email: user.email, redirectTo: '/reset-password' }),
    onSuccess: () => {
      toast.success('Redefinição de senha enviada com sucesso');
      setOpen(false);
    },
    onError: (error) =>
      toast.error('Falha ao enviar a redefinição de senha', {
        description: error.message,
      }),
  });

  return (
    <>
      <Tooltip>
        <TooltipTrigger render={<Button size="icon-sm" onClick={() => setOpen(true)} />}>
          <IconPlus />
        </TooltipTrigger>
        <TooltipContent>Definir senha</TooltipContent>
      </Tooltip>

      <AlertDialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && mutation.isPending) return;
          setOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Definir senha</AlertDialogTitle>
            <AlertDialogDescription>
              Será enviado um link para seu email para redefinir sua senha.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutation.mutate()} disabled={mutation.isPending}>
              {mutation.isPending && <Spinner />}
              Enviar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
