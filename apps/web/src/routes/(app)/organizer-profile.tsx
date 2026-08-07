import {
  formatCnpj,
  organizerProfileUpsertInputSchema,
  type OrganizerProfileUpsertInput,
} from '@lumos/validation/organizer';
import { IconAlertCircle } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useId } from 'react';
import { toast } from 'sonner';

import { Loading } from '@/components/misc/loading';
import { AppInset } from '@/components/sidebar/inset';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { rpc } from '@/lib/rpc';

export const Route = createFileRoute('/(app)/organizer-profile')({
  loader: () => ({ breadcrumb: [{ label: 'Perfil organizador' }] }),
  component: OrganizerProfilePage,
});

const defaultValues: OrganizerProfileUpsertInput = {
  type: 'INDIVIDUAL',
  displayName: '',
  bio: '',
  websiteUrl: '',
  cnpj: '',
};

function OrganizerProfilePage() {
  const formId = useId();

  const queryClient = useQueryClient();
  const profileQuery = useQuery(rpc.organizer.me.queryOptions());

  const mutation = useMutation(
    rpc.organizer.upsert.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: rpc.organizer.me.key() }),
          queryClient.invalidateQueries({ queryKey: rpc.campaign.canCreate.key() }),
        ]);
        toast.success('Perfil organizador salvo com sucesso.');
      },
      onError: (error) =>
        toast.error('Não foi possível salvar o perfil organizador.', {
          description: error.message,
        }),
    }),
  );

  const form = useForm({
    defaultValues,
    validators: { onSubmit: organizerProfileUpsertInputSchema },
    onSubmit: ({ value }) => mutation.mutate(value),
  });

  useEffect(() => {
    if (!profileQuery.data) return;
    form.reset({
      type: profileQuery.data.type,
      displayName: profileQuery.data.displayName,
      bio: profileQuery.data.bio ?? '',
      websiteUrl: profileQuery.data.websiteUrl ?? '',
      cnpj: profileQuery.data.cnpj ?? '',
    });
  }, [form, profileQuery.data]);

  return (
    <AppInset breadcrumbs={[{ label: 'Perfil organizador' }]}>
      <div className="w-full max-w-2xl space-y-5">
        {profileQuery.isPending && <Loading description="Carregando perfil organizador" />}

        {profileQuery.isError && (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Não foi possível carregar o perfil</AlertTitle>
            <AlertDescription>{profileQuery.error.message}</AlertDescription>
          </Alert>
        )}

        {profileQuery.isSuccess && (
          <Card>
            <CardHeader>
              <CardTitle>
                {profileQuery.data ? 'Editar perfil organizador' : 'Criar perfil organizador'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                id={formId}
                className="space-y-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  form.handleSubmit();
                }}
              >
                <FieldGroup>
                  <form.Field name="displayName">
                    {(field) => (
                      <TextField
                        field={field}
                        label="Nome de exibição"
                        placeholder="Como sua causa será identificada"
                      />
                    )}
                  </form.Field>
                  <form.Field name="type">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Tipo de organizador</FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.setValue(value as OrganizerProfileUpsertInput['type'])
                          }
                        >
                          <SelectTrigger id={field.name} className="w-full">
                            <SelectValue>
                              {field.state.value === 'ORGANIZATION' ? 'Organização' : 'Pessoa física'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INDIVIDUAL">Pessoa física</SelectItem>
                            <SelectItem value="ORGANIZATION">Organização</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>
                  <form.Subscribe selector={(state) => state.values.type}>
                    {(type) =>
                      type === 'ORGANIZATION' && (
                        <form.Field name="cnpj">
                          {(field) => (
                            <TextField
                              field={field}
                              label="CNPJ"
                              placeholder="00.000.000/0000-00"
                              description="Usado publicamente para transparência."
                            />
                          )}
                        </form.Field>
                      )
                    }
                  </form.Subscribe>
                  <form.Field name="websiteUrl">
                    {(field) => (
                      <TextField
                        field={field}
                        label="Site"
                        placeholder="https://suaorganizacao.org"
                        description="Opcional e público."
                      />
                    )}
                  </form.Field>
                  <form.Field name="bio">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Sobre</FieldLabel>
                          <Textarea
                            id={field.name}
                            value={field.state.value ?? ''}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.setValue(event.target.value)}
                            placeholder="Conte brevemente sobre a sua causa"
                          />
                          <FieldDescription>Opcional e público.</FieldDescription>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      );
                    }}
                  </form.Field>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter className="justify-end">
              <form.Subscribe selector={(state) => ({ isValid: state.isValid })}>
                {({ isValid }) => (
                  <Button type="submit" form={formId} disabled={!isValid || mutation.isPending}>
                    {mutation.isPending && <Spinner />}
                    Salvar perfil
                  </Button>
                )}
              </form.Subscribe>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppInset>
  );
}

function TextField({
  field,
  label,
  placeholder,
  description,
}: {
  field: {
    name: string;
    state: {
      value: string | undefined;
      meta: { isTouched: boolean; isValid: boolean; errors: unknown[] };
    };
    handleBlur: () => void;
    setValue: (value: string) => void;
  };
  label: string;
  placeholder: string;
  description?: string;
}) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const value =
    field.name === 'cnpj' ? formatCnpj(field.state.value ?? '') : (field.state.value ?? '');

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        value={value}
        onBlur={field.handleBlur}
        onChange={(event) => field.setValue(event.target.value)}
        placeholder={placeholder}
        aria-invalid={isInvalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors as Array<{ message?: string }>} />}
    </Field>
  );
}
