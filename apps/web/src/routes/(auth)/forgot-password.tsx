import { authClient } from '@lumos/auth/auth-client';
import { emailSchema } from '@lumos/validation/user';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useId } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPasswordPage,
});

const formSchema = v.object({
  email: emailSchema,
});

function ForgotPasswordPage() {
  const mutation = useMutation({
    mutationFn: async (email: string) =>
      await authClient.requestPasswordReset({ email, redirectTo: '/reset-password' }),
    onSuccess: () =>
      toast.success('Solicitação enviada com sucesso', {
        description: 'Verifique seu e-mail para redefinir sua senha',
      }),
    onError: (error) =>
      toast.error('Falha ao solicitar redefinição de senha', {
        description: error.message,
      }),
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
    <Card size="sm" className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg!">Esqueceu a senha?</CardTitle>
        <CardDescription>
          Digite seu e-mail e enviaremos um link para redefinir sua senha
        </CardDescription>
      </CardHeader>

      <CardContent>
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
              Enviar
            </Button>
          )}
        </form.Subscribe>
      </CardFooter>
    </Card>
  );
}
