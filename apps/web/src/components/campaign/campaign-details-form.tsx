import {
  CAMPAIGN_COLLECTION_POINT_MAX_COUNT,
  CampaignType,
  campaignDetailsUpdateInputSchema,
} from '@lumos/validation/campaign';
import { IconDeviceFloppy, IconPlus, IconTrash } from '@tabler/icons-react';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useId } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { invalidateCampaignManagement } from '@/lib/queries/campaign';
import { rpc } from '@/lib/rpc';

type OwnerCampaign = Awaited<ReturnType<typeof rpc.campaign.byId.call>>;

type CollectionPointFormValue = {
  id?: string;
  key?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  instructions?: string;
};

type CampaignDetailsFormValue = {
  id: string;
  title: string;
  description: string;
  category: string;
  region: string;
  startDate: string;
  endDate: string;
  type: CampaignType;
  location?: string;
  targetItems?: number;
  collectionPoints?: CollectionPointFormValue[];
  pixKey?: string;
  bankAccountInfo?: string;
};

export function CampaignDetailsForm({
  campaign,
  onCancel,
  onSuccess,
}: {
  campaign: OwnerCampaign;
  onCancel: () => void;
  onSuccess: () => Promise<void> | void;
}) {
  const queryClient = useQueryClient();
  const formId = useId();
  const mutation = useMutation(
    rpc.campaign.updateDetails.mutationOptions({
      onSuccess: async () => {
        await invalidateCampaignManagement(queryClient, campaign.id);
        toast.success('Detalhes da campanha atualizados.');
        await onSuccess();
      },
      onError: (error) =>
        toast.error('Não foi possível atualizar a campanha.', { description: error.message }),
    }),
  );

  const form = useCampaignDetailsForm(toFormValue(campaign), ({ value }) => {
    const result = v.safeParse(campaignDetailsUpdateInputSchema, value);
    if (result.success) mutation.mutate(result.output);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar campanha</CardTitle>
        <CardDescription>
          Atualize as informações que os doadores usam para contribuir. O tipo da campanha não pode
          ser alterado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mutation.isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Não foi possível atualizar a campanha</AlertTitle>
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        )}

        <form
          id={formId}
          className="flex flex-col gap-8"
          aria-busy={mutation.isPending}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <fieldset className="contents" disabled={mutation.isPending}>
            <FieldSet>
              <FieldLegend>Informações principais</FieldLegend>
              <FieldDescription>
                Mantenha a causa e a região atendida claras para os doadores.
              </FieldDescription>
              <FieldGroup>
                <form.Field name="title">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Título"
                      required
                      placeholder="Ex: Alimentos para famílias"
                    />
                  )}
                </form.Field>
                <form.Field name="description">
                  {(field) => (
                    <TextAreaField
                      field={field}
                      label="Descrição"
                      required
                      placeholder="Descreva a causa, o objetivo e quem será beneficiado"
                    />
                  )}
                </form.Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <form.Field name="category">
                    {(field) => <TextField field={field} label="Categoria" required />}
                  </form.Field>
                  <form.Field name="region">
                    {(field) => <TextField field={field} label="Região" required />}
                  </form.Field>
                </div>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Período</FieldLegend>
              <FieldDescription>
                Defina o período em que a campanha permanecerá ativa.
              </FieldDescription>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <form.Field name="startDate">
                    {(field) => (
                      <TextField field={field} label="Data inicial" type="date" required />
                    )}
                  </form.Field>
                  <form.Field name="endDate">
                    {(field) => (
                      <TextField
                        field={field}
                        label="Data final"
                        type="date"
                        required
                        description="Deve ser posterior à data inicial."
                      />
                    )}
                  </form.Field>
                </div>
              </FieldGroup>
            </FieldSet>

            <form.Subscribe selector={(state) => state.values.type}>
              {(type) =>
                type === CampaignType.PHYSICAL ? (
                  <PhysicalFields form={form} />
                ) : (
                  <VirtualFields form={form} />
                )
              }
            </form.Subscribe>
          </fieldset>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-3">
        <Button type="button" variant="outline" disabled={mutation.isPending} onClick={onCancel}>
          Cancelar
        </Button>
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button type="submit" form={formId} disabled={!canSubmit || mutation.isPending}>
              {mutation.isPending ? <Spinner /> : <IconDeviceFloppy />}
              {mutation.isPending ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          )}
        </form.Subscribe>
      </CardFooter>
    </Card>
  );
}

function PhysicalFields({ form }: { form: ReturnType<typeof useCampaignDetailsForm> }) {
  return (
    <FieldSet>
      <FieldLegend>Coleta dos itens</FieldLegend>
      <FieldDescription>Atualize a meta e os locais públicos de entrega.</FieldDescription>
      <FieldGroup>
        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="location">
            {(field) => <TextField field={field} label="Local principal" required />}
          </form.Field>
          <form.Field name="targetItems">
            {(field) => (
              <NumberField
                field={field}
                label="Meta de itens"
                min={1}
                description="A quantidade atual recebida não é alterada."
              />
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => state.values.collectionPoints ?? []}>
          {(collectionPoints) => (
            <FieldSet className="rounded-lg border p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <FieldLegend>Pontos de coleta</FieldLegend>
                  <FieldDescription>
                    Informe entre um e {CAMPAIGN_COLLECTION_POINT_MAX_COUNT} endereços públicos para
                    entrega.
                  </FieldDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={collectionPoints.length >= CAMPAIGN_COLLECTION_POINT_MAX_COUNT}
                  onClick={() =>
                    form.setFieldValue('collectionPoints', [
                      ...collectionPoints,
                      emptyCollectionPoint(),
                    ])
                  }
                >
                  <IconPlus /> Adicionar ponto
                </Button>
              </div>
              <FieldGroup>
                {collectionPoints.map((point, index) => (
                  <FieldSet
                    key={point.key ?? `${point.name}-${point.address}`}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <FieldLegend>Ponto {index + 1}</FieldLegend>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={collectionPoints.length <= 1}
                        onClick={() =>
                          form.setFieldValue(
                            'collectionPoints',
                            collectionPoints.filter((_, pointIndex) => pointIndex !== index),
                          )
                        }
                      >
                        <IconTrash /> Remover
                      </Button>
                    </div>
                    <FieldGroup>
                      <form.Field name={`collectionPoints[${index}].name`}>
                        {(field) => <TextField field={field} label="Nome do ponto" required />}
                      </form.Field>
                      <form.Field name={`collectionPoints[${index}].address`}>
                        {(field) => <TextField field={field} label="Endereço" required />}
                      </form.Field>
                      <div className="grid gap-4 md:grid-cols-3">
                        <form.Field name={`collectionPoints[${index}].city`}>
                          {(field) => <TextField field={field} label="Cidade" required />}
                        </form.Field>
                        <form.Field name={`collectionPoints[${index}].state`}>
                          {(field) => <TextField field={field} label="Estado" required />}
                        </form.Field>
                        <form.Field name={`collectionPoints[${index}].zipCode`}>
                          {(field) => <TextField field={field} label="CEP" required />}
                        </form.Field>
                      </div>
                      <form.Field name={`collectionPoints[${index}].instructions`}>
                        {(field) => <TextAreaField field={field} label="Instruções de entrega" />}
                      </form.Field>
                    </FieldGroup>
                  </FieldSet>
                ))}
              </FieldGroup>
            </FieldSet>
          )}
        </form.Subscribe>
      </FieldGroup>
    </FieldSet>
  );
}

function VirtualFields({ form }: { form: ReturnType<typeof useCampaignDetailsForm> }) {
  return (
    <FieldSet>
      <FieldLegend>Recebimento das doações</FieldLegend>
      <FieldDescription>
        Mantenha pelo menos uma forma de transferência disponível para os doadores.
      </FieldDescription>
      <FieldGroup>
        <form.Field name="pixKey">
          {(field) => <TextField field={field} label="Chave PIX" />}
        </form.Field>
        <form.Field name="bankAccountInfo">
          {(field) => <TextAreaField field={field} label="Dados bancários" />}
        </form.Field>
      </FieldGroup>
    </FieldSet>
  );
}

function useCampaignDetailsForm(
  defaultValues: CampaignDetailsFormValue,
  onSubmit: (args: { value: CampaignDetailsFormValue }) => void,
) {
  return useForm({
    defaultValues,
    validators: { onDynamic: campaignDetailsUpdateInputSchema },
    validationLogic: revalidateLogic({ mode: 'submit', modeAfterSubmission: 'change' }),
    onSubmit,
  });
}

type FormField = {
  name: string;
  state: {
    value: string | number | undefined;
    meta: { isTouched: boolean; isValid: boolean; errors: unknown[] };
  };
  handleBlur: () => void;
  setValue: (value: never) => void;
};

function TextField({
  field,
  label,
  placeholder,
  description,
  required,
  type,
}: {
  field: FormField;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  type?: React.ComponentProps<typeof Input>['type'];
}) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <RequiredMark />}
      </FieldLabel>
      <Input
        id={field.name}
        type={type}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(event) => field.setValue(event.target.value as never)}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        aria-required={required || undefined}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors as Array<{ message?: string }>} />}
    </Field>
  );
}

function NumberField({
  field,
  label,
  min,
  description,
}: {
  field: FormField;
  label: string;
  min: number;
  description?: string;
}) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label} <RequiredMark />
      </FieldLabel>
      <Input
        id={field.name}
        type="number"
        min={min}
        step={1}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(event) => field.setValue(Number(event.target.value) as never)}
        aria-invalid={isInvalid}
        aria-required="true"
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors as Array<{ message?: string }>} />}
    </Field>
  );
}

function TextAreaField({
  field,
  label,
  placeholder,
  description,
  required,
}: {
  field: FormField;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
}) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <RequiredMark />}
      </FieldLabel>
      <Textarea
        id={field.name}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(event) => field.setValue(event.target.value as never)}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        aria-required={required || undefined}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors as Array<{ message?: string }>} />}
    </Field>
  );
}

function toFormValue(campaign: OwnerCampaign): CampaignDetailsFormValue {
  return {
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    category: campaign.category,
    region: campaign.region,
    startDate: toDateInput(campaign.startDate),
    endDate: toDateInput(campaign.endDate),
    type: campaign.type,
    ...(campaign.type === CampaignType.PHYSICAL
      ? {
          location: campaign.location ?? '',
          targetItems: campaign.targetItems ?? 1,
          collectionPoints: campaign.collectionPoints.map((point) => ({
            id: point.id,
            key: point.id,
            name: point.name,
            address: point.address,
            city: point.city,
            state: point.state,
            zipCode: point.zipCode,
            instructions: point.instructions ?? '',
          })),
        }
      : {
          pixKey: campaign.pixKey ?? '',
          bankAccountInfo: campaign.bankAccountInfo ?? '',
        }),
  };
}

function toDateInput(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}

function emptyCollectionPoint(): CollectionPointFormValue {
  return {
    key: crypto.randomUUID(),
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: '',
  };
}

function RequiredMark() {
  return (
    <>
      <span className="text-destructive" aria-hidden="true">
        *
      </span>
      <span className="sr-only"> (obrigatório)</span>
    </>
  );
}
