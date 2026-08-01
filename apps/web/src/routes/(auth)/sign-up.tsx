import { authClient } from '@lumos/auth/auth-client';
import { env } from '@lumos/env/web';
import {
  confirmPasswordSchema,
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@lumos/validation/user';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Logo } from '@/components/logo';
import { PasswordInput } from '@/components/misc/password-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUpPage,
});

const formSchema = v.pipe(
  v.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  }),
  v.forward(
    v.check((data) => data.password === data.confirmPassword, 'Senhas não coincidem'),
    ['confirmPassword'],
  ),
);

function SignUpPage() {
  const mutation = useMutation({
    mutationFn: async (data: v.InferOutput<typeof formSchema>) =>
      await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: '/',
      }),
    onSuccess: () =>
      toast.success('Conta criada com sucesso', {
        description: 'Verifique seu e-mail para confirmar sua conta',
      }),
    onError: (error) =>
      toast.error('Erro ao criar conta', {
        description: error.message,
      }),
  });

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => mutation.mutate(value),
  });

  if (!env.VITE_SIGNUP_ENABLED) {
    return (
      <Alert className="max-w-sm space-y-1">
        <AlertTitle className="text-lg">Cadastro desativado</AlertTitle>
        <AlertDescription>O cadastro de novos usuários está desativado no momento</AlertDescription>
        <Button size="sm" nativeButton={false} render={<Link to="/sign-in" />} className="mt-1">
          Entrar com uma conta existente
        </Button>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center justify-center gap-y-4">
            <Link to="/">
              <Logo className="text-xl" />
            </Link>
            <FieldDescription>
              Já tem uma conta? <Link to="/sign-in">Entrar</Link>
            </FieldDescription>
          </div>

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
                    onChange={(e) => field.setValue(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Digite seu nome"
                    autoComplete="name"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="email">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.setValue(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Digite seu e-mail"
                    autoComplete="email"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="password">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.setValue(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Digite sua senha"
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
                    onChange={(e) => field.setValue(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Confirme sua senha"
                    autoComplete="new-password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Subscribe
            selector={(state) => ({
              isDefaultValue: state.isDefaultValue,
              isValid: state.isValid,
            })}
          >
            {({ isDefaultValue, isValid }) => (
              <Button type="submit" disabled={isDefaultValue || !isValid || mutation.isPending}>
                {mutation.isPending && <Spinner />}
                Criar conta
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </div>
  );
}
