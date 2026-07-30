import { authClient } from '@lumos/auth/auth-client';
import { emailSchema, passwordSchema, usernameSchema } from '@lumos/validation/user';
import { IconBrandGoogle, IconKey } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { ClientOnly, createFileRoute, Link } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Logo } from '@/components/logo';
import { PasswordInput } from '@/components/misc/password-input';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignInPage,
});

const methods: Record<string, string> = {
  email: 'Email',
  username: 'Nome de Usuário',
  google: 'Google',
  passkey: 'Chave de Acesso',
};

const formSchema = v.object({
  login: v.union([usernameSchema, emailSchema], 'Deve ser um nome de usuário ou email válido'),
  password: passwordSchema,
  remember: v.boolean(),
});

function SignInPage() {
  const navigate = Route.useNavigate();

  const [supportsPasskey, setSupportsPasskey] = useState<boolean>();

  const lastUsedMethod = authClient.getLastUsedLoginMethod();

  const socialMutation = useMutation({
    mutationFn: async (provider: string) =>
      await authClient.signIn.social({ provider, callbackURL: '/' }),
    onError: (error) => toast.error('Error ao entrar', { description: error.message }),
  });

  const formMutation = useMutation({
    mutationFn: async (data: v.InferOutput<typeof formSchema>) => {
      const isEmail = v.safeParse(emailSchema, data.login).success;

      if (isEmail)
        await authClient.signIn.email({
          email: data.login,
          password: data.password,
          rememberMe: data.remember,
        });
      else
        await authClient.signIn.username({
          username: data.login,
          password: data.password,
          rememberMe: data.remember,
        });
    },
    onSuccess: () => {
      toast.success('Entrou com sucesso');
      navigate({ to: '/' });
    },
    onError: (error) => toast.error('Error ao entrar', { description: error.message }),
  });

  const isPending = socialMutation.isPending || formMutation.isPending;

  const form = useForm({
    defaultValues: {
      login: '',
      password: '',
      remember: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => formMutation.mutate(value),
  });

  const requestPasskey = useCallback(() => {
    authClient.signIn.passkey({
      autoFill: true,
      fetchOptions: {
        onSuccess: () => navigate({ to: '/' }),
        onError: (ctx) => void toast.error('Error ao entrar', { description: ctx.error.message }),
      },
    });
  }, [navigate]);

  useEffect(() => {
    if (supportsPasskey !== undefined) return;
    (async () => {
      const isSupported = await PublicKeyCredential.isConditionalMediationAvailable();
      setSupportsPasskey(isSupported);
    })();
  }, [supportsPasskey, requestPasskey]);

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
              Não tem uma conta? <Link to="/sign-up">Cadastre-se</Link>
            </FieldDescription>
          </div>

          <ClientOnly>
            {lastUsedMethod && (
              <Alert>
                <AlertTitle className="text-center">
                  Último método usado: {methods[lastUsedMethod]}
                </AlertTitle>
              </Alert>
            )}
          </ClientOnly>

          <Field>
            <Button variant="outline" onClick={() => socialMutation.mutate('google')}>
              <IconBrandGoogle className="size-5" /> Entrar com Google
            </Button>
            <Button variant="outline" onClick={() => requestPasskey()} disabled={!supportsPasskey}>
              <IconKey className="size-5" /> Entrar com Chave de Acesso
            </Button>
          </Field>
          <FieldSeparator>ou</FieldSeparator>
          <form.Field name="login">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email ou Nome de Usuário</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Digite seu email ou nome de usuário"
                    autoComplete="email username webauthn"
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
                  <FieldLabel htmlFor={field.name}>
                    Senha{' '}
                    <Link to="/forgot-password" tabIndex={-1} className="ml-auto default-link">
                      Esqueceu a senha?
                    </Link>
                  </FieldLabel>
                  <PasswordInput
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Digite sua senha"
                    autoComplete="current-password webauthn"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="remember">
            {(field) => (
              <Field orientation="horizontal">
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
                <FieldLabel htmlFor={field.name}>Lembrar de mim</FieldLabel>
              </Field>
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => ({
              isDefaultValue: state.isDefaultValue,
              isValid: state.isValid,
            })}
          >
            {({ isDefaultValue, isValid }) => (
              <Button type="submit" disabled={isDefaultValue || !isValid || isPending}>
                {isPending && <Spinner />}
                Entrar
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </div>
  );
}
