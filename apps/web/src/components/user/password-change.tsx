import { authClient } from '@lumos/auth/auth-client';
import { confirmPasswordSchema, passwordSchema } from '@lumos/validation/user';
import { IconPencilFilled } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { PasswordInput } from '@/components/misc/password-input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useStrictAuth } from '@/lib/auth/hooks';
import { authQueryKeys } from '@/lib/queries/auth';

const formSchema = v.pipe(
  v.object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  }),
  v.forward(
    v.check((data) => data.newPassword === data.confirmPassword, 'Senhas não coincidem'),
    ['confirmPassword'],
  ),
);

export function UserPasswordChange() {
  const queryClient = useQueryClient();
  const { user } = useStrictAuth();
  const [isOpen, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: v.InferOutput<typeof formSchema>) =>
      await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.sessions(user.id) });
      toast.success('Senha alterada com sucesso');
      setOpen(false);
      form.reset();
    },
    onError: (error) => toast.error('Falha ao alterar senha', { description: error.message }),
  });

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => mutation.mutate(value),
  });

  const formId = useId();

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="outline" size="icon-sm" onClick={() => setOpen(true)} />}
        >
          <IconPencilFilled />
        </TooltipTrigger>
        <TooltipContent>Alterar senha</TooltipContent>
      </Tooltip>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (mutation.isPending) return;
            else form.reset();
          }
          setOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar senha</DialogTitle>
            <DialogDescription>Você será desconectado de todas as sessões ativas</DialogDescription>
          </DialogHeader>

          <form
            id={formId}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="currentPassword">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Senha atual</FieldLabel>
                      <PasswordInput
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Digite sua senha atual"
                        autoComplete="current-password"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="newPassword">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Nova senha</FieldLabel>
                      <PasswordInput
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Digite sua nova senha"
                        autoComplete="new-password"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="confirmPassword">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Confirmar senha</FieldLabel>
                      <PasswordInput
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Confirme sua nova senha"
                        autoComplete="new-password"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" disabled={mutation.isPending} />}>
              Cancelar
            </DialogClose>
            <form.Subscribe
              selector={(state) => ({
                isDefaultValue: state.isDefaultValue,
                isValid: state.isValid,
              })}
            >
              {({ isDefaultValue, isValid }) => (
                <Button
                  type="submit"
                  form={formId}
                  disabled={isDefaultValue || !isValid || mutation.isPending}
                >
                  {mutation.isPending && <Spinner />}
                  Salvar
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
