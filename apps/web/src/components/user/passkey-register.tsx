import { authClient } from '@lumos/auth/auth-client';
import { useForm } from '@tanstack/react-form';
import { useMutation, type QueryClient } from '@tanstack/react-query';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';

const formSchema = v.object({
  name: v.pipe(v.string('Nome deve ser uma string'), v.nonEmpty('Nome não pode ser vazio')),
});

export function UserPasskeyRegister({
  isPending,
  queryClient,
}: {
  isPending: boolean;
  queryClient: QueryClient;
}) {
  const [isOpen, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: v.InferOutput<typeof formSchema>) =>
      await authClient.passkey.addPasskey({ name: data.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passkeys'] });
      toast.success('Chave de acesso registrada com sucesso');
      setOpen(false);
    },
    onError: (error) =>
      toast.error('Falha ao registrar chave de acesso', {
        description: error.message,
      }),
  });

  const form = useForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => mutation.mutate(value),
  });

  const formId = useId();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (mutation.isPending) return;
          else form.reset();
        }
        setOpen(open);
      }}
    >
      <DialogTrigger render={<Button disabled={isPending} />}>Registrar chave</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar chave de acesso</DialogTitle>
        </DialogHeader>

        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="name">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Digite o nome da chave de acesso"
                    autoFocus
                  />
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
                Submit
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
