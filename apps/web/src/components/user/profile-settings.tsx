import { authClient } from '@lumos/auth/auth-client';
import { nameSchema, usernameSchema } from '@lumos/validation/user';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useId } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useStrictAuth } from '@/lib/auth/hooks';

import { UserAvatarChange } from './avatar-change';
import { UserEmailChange } from './email-change';

const formSchema = v.object({
  name: nameSchema,
  username: usernameSchema,
});

export function UserProfileSettings() {
  const { user } = useStrictAuth();

  const mutation = useMutation({
    mutationFn: async (data: v.InferOutput<typeof formSchema>) => {
      if (data.username !== user.username) {
        const response = await authClient.isUsernameAvailable({ username: data.username });
        if (!response.data?.available) throw new Error('Nome de usuário indisponível');
      }

      await authClient.updateUser(data);
    },
    onSuccess: () => toast.success('Perfil atualizado com sucesso'),
    onError: (error) =>
      toast.error('Falha ao atualizar perfil', {
        description: error.message,
      }),
  });

  const form = useForm({
    defaultValues: {
      name: user.name,
      // oxlint-disable-next-line typescript/no-non-null-assertion
      username: user.username!,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => mutation.mutate(value),
  });

  useEffect(() => {
    form.reset({
      name: user.name,
      // oxlint-disable-next-line typescript/no-non-null-assertion
      username: user.username!,
    });
  }, [form, user]);

  const formId = useId();

  return (
    <Card size="sm" className="max-w-lg">
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel>Foto de perfil</FieldLabel>
            <UserAvatarChange />
          </Field>
          <Field orientation="responsive">
            <FieldLabel>Email</FieldLabel>
            <UserEmailChange />
          </Field>

          <form
            id={formId}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field orientation="responsive" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Digite seu nome"
                        className="w-fit"
                        autoComplete="name"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="username">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field orientation="responsive" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Digite seu username"
                        autoComplete="username"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </FieldGroup>
      </CardContent>

      <CardFooter className="justify-end">
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
      </CardFooter>
    </Card>
  );
}
