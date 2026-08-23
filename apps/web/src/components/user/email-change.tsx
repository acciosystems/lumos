import { authClient } from '@lumos/auth/auth-client';
import { emailSchema } from '@lumos/validation/user';
import { IconPencilFilled } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useStrictAuth } from '@/lib/auth/hooks';

const formSchema = v.object({
  email: emailSchema,
});

export function UserEmailChange() {
  const { user } = useStrictAuth();

  const [isOpen, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (email: string) => await authClient.changeEmail({ newEmail: email }),
    onSuccess: () => {
      toast.success('Email atualizado com sucesso', {
        description: 'Um email de confirmação foi enviado para o novo endereço',
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => toast.error('Falha ao atualizar email', { description: error.message }),
  });

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => mutation.mutate(value.email),
  });

  const formId = useId();

  return (
    <>
      <div className="flex items-center gap-2">
        <p>{user.email}</p>
        <Tooltip>
          <TooltipTrigger
            render={<Button variant="outline" size="icon-sm" onClick={() => setOpen(true)} />}
          >
            <IconPencilFilled />
          </TooltipTrigger>
          <TooltipContent>Alterar email</TooltipContent>
        </Tooltip>
      </div>

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
            <DialogTitle>Alterar email</DialogTitle>
          </DialogHeader>

          <form
            id={formId}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Digite seu novo email"
                      autoComplete="email"
                      autoFocus={true}
                    />
                    <FieldDescription>
                      Um email de confirmação será enviado para o novo endereço
                    </FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
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
