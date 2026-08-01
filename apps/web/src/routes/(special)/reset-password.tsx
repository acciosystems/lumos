import { authClient } from '@lumos/auth/auth-client';
import { passwordSchema } from '@lumos/validation/user';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useId } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { PasswordInput } from '@/components/misc/password-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';

const searchSchema = v.object({
  token: v.pipe(v.string(), v.nonEmpty()),
});

export const Route = createFileRoute('/(special)/reset-password')({
  validateSearch: searchSchema,
  component: ResetPasswordPage,
});

const formSchema = v.object({
  password: passwordSchema,
  confirmPassword: v.pipe(
    v.string('Senha deve ser uma string'),
    v.nonEmpty('Senha não pode estar vazia'),
  ),
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (password: string) =>
      await authClient.resetPassword({ token, newPassword: password }),
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso!', {
        description: 'Você pode agora fazer login com sua nova senha',
      });
      navigate({ to: '/sign-in' });
    },
    onError: (error) =>
      toast.error('Falha ao redefinir a senha', {
        description: error.message,
      }),
  });

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => mutation.mutate(value.password),
  });

  const formId = useId();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg!">Redefinir Senha</CardTitle>
        <CardDescription>Digite sua nova senha abaixo</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="password">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Nova Senha</FieldLabel>
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
                    <FieldLabel htmlFor={field.name}>Confirmar Senha</FieldLabel>
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
              Redefinir
            </Button>
          )}
        </form.Subscribe>
      </CardFooter>
    </Card>
  );
}
