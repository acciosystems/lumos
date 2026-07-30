import { authClient } from '@lumos/auth/auth-client';
import { usernameSchema } from '@lumos/validation/user';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useId } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { ensureAuthFn } from '@/lib/auth/functions';
import { rpc } from '@/lib/rpc';

export const Route = createFileRoute('/(special)/onboarding')({
  beforeLoad: async () => await ensureAuthFn(),
  component: OnboardingPage,
});

const formSchema = v.object({
  username: usernameSchema,
});

function OnboardingPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: v.InferOutput<typeof formSchema>) => {
      await authClient.updateUser(data);
      await rpc.user.onboard.call();
    },
    onSuccess: () => {
      toast.success('Usuário configurado com sucesso');
      navigate({ to: '/' });
    },
    onError: (error) =>
      toast.error('Falha ao configurar usuário', {
        description: error.message,
      }),
  });

  const form = useForm({
    defaultValues: {
      username: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => mutation.mutate(value),
  });

  const formId = useId();

  return (
    <Card size="sm" className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg!">Configuração inicial</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="username">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Nome de usuário</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Digite seu nome de usuário"
                    autoComplete="username"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
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
              Continuar
            </Button>
          )}
        </form.Subscribe>
      </CardFooter>
    </Card>
  );
}
