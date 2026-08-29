import {
  CampaignType,
  campaignCreateInputSchema,
  campaignTypeSchema,
} from '@lumos/validation/campaign';
import { IconAlertCircle, IconDeviceFloppy } from '@tabler/icons-react';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useId } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { CampaignAssetUploadField } from '@/components/campaign/campaign-asset-upload-field';
import { Loading } from '@/components/misc/loading';
import { AppInset } from '@/components/sidebar/inset';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useCampaignAssetUploads } from '@/hooks/use-campaign-asset-uploads';
import { invalidateCampaignLists } from '@/lib/queries/campaign';
import { rpc } from '@/lib/rpc';
import {
  campaignTypeMetadata,
  campaignTypeValues,
  isPhysicalCampaign,
} from '@/utils/campaign-type';

export const Route = createFileRoute('/(app)/campaigns/new')({
  loader: () => ({ breadcrumb: [{ label: 'Campanhas', href: '/campaigns' }, { label: 'Criar' }] }),
  component: NewCampaignPage,
});

type CollectionPointFormValue = {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  instructions?: string;
};

type CampaignCommonFormValue = {
  title: string;
  description: string;
  category: string;
  region: string;
  startDate: string;
  endDate: string;
  imageUploadId?: string;
};

type CampaignFormValue = CampaignCommonFormValue &
  (
    | {
        type: typeof CampaignType.PHYSICAL;
        location: string;
        targetItems: number;
        collectionPoints: CollectionPointFormValue[];
        pixKey?: string;
        bankAccountInfo?: string;
      }
    | {
        type: typeof CampaignType.VIRTUAL;
        pixKey?: string;
        bankAccountInfo?: string;
        location?: string;
        targetItems?: number;
        collectionPoints?: CollectionPointFormValue[];
      }
  );

const defaultValues: CampaignFormValue = {
  title: '',
  description: '',
  type: CampaignType.PHYSICAL,
  category: '',
  region: '',
  startDate: '',
  endDate: '',
  imageUploadId: undefined,
  location: '',
  targetItems: 1,
  pixKey: '',
  bankAccountInfo: '',
  collectionPoints: [
    {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      instructions: '',
    },
  ],
};

function NewCampaignPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formId = useId();
  const imageUpload = useCampaignAssetUploads({ kind: 'IMAGE' });

  const organizerProfileQuery = useQuery(rpc.campaign.canCreate.queryOptions());

  const mutation = useMutation(
    rpc.campaign.create.mutationOptions({
      onSuccess: async (campaign) => {
        imageUpload.releaseAssets();
        await invalidateCampaignLists(queryClient);
        toast.success('Campanha criada com sucesso.');
        await navigate({ to: '/campaigns/my/$id', params: { id: campaign.id } });
      },
      onError: (error) => {
        imageUpload.markReadyAssetsFailed('Verifique a imagem e tente enviá-la novamente.');
        toast.error('Não foi possível criar a campanha.', { description: error.message });
      },
    }),
  );

  const form = useForm({
    defaultValues,
    validators: { onDynamic: campaignCreateInputSchema },
    validationLogic: revalidateLogic({ mode: 'submit', modeAfterSubmission: 'change' }),
    onSubmit: ({ value }) => {
      const result = v.safeParse(campaignCreateInputSchema, {
        ...value,
        imageUploadId: imageUpload.readyUploadIds[0],
      });
      if (result.success) mutation.mutate(result.output);
    },
  });

  const physicalFields = (
    <FieldSet>
      <FieldLegend>Coleta dos itens</FieldLegend>
      <FieldDescription>
        Informe a meta da campanha e onde as doações físicas serão recebidas.
      </FieldDescription>
      <FieldGroup>
        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="location">
            {(field) => (
              <TextField
                field={field}
                label="Local principal"
                placeholder="Ex: Centro comunitário"
                description="Nome do local que identifica a coleta."
                required
              />
            )}
          </form.Field>

          <form.Field name="targetItems">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <RequiredLabel htmlFor={field.name}>Meta de itens</RequiredLabel>
                  <Input
                    id={field.name}
                    type="number"
                    min={1}
                    step={1}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.setValue(Number(event.target.value))}
                    aria-invalid={isInvalid}
                    aria-required="true"
                  />
                  <FieldDescription>
                    Quantidade total de itens que a campanha pretende receber.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <FieldSet className="rounded-lg border p-4">
          <FieldLegend>
            Ponto de coleta <RequiredMark />
          </FieldLegend>
          <FieldDescription>
            Endereço público onde os doadores poderão entregar os itens.
          </FieldDescription>
          <FieldGroup>
            <form.Field name="collectionPoints[0].name">
              {(field) => (
                <TextField
                  field={field}
                  label="Nome do ponto"
                  placeholder="Ex: Centro comunitário"
                  required
                />
              )}
            </form.Field>

            <form.Field name="collectionPoints[0].address">
              {(field) => (
                <TextField
                  field={field}
                  label="Endereço"
                  placeholder="Rua, número e complemento"
                  required
                />
              )}
            </form.Field>

            <div className="grid gap-4 md:grid-cols-3">
              <form.Field name="collectionPoints[0].city">
                {(field) => <TextField field={field} label="Cidade" required />}
              </form.Field>

              <form.Field name="collectionPoints[0].state">
                {(field) => (
                  <TextField field={field} label="Estado" placeholder="Ex: SP" required />
                )}
              </form.Field>

              <form.Field name="collectionPoints[0].zipCode">
                {(field) => (
                  <TextField field={field} label="CEP" placeholder="00000-000" required />
                )}
              </form.Field>
            </div>

            <form.Field name="collectionPoints[0].instructions">
              {(field) => (
                <TextAreaField
                  field={field}
                  label="Instruções de entrega"
                  placeholder="Ex: Entregas de segunda a sexta, das 9h às 17h"
                  description="Opcional. Informe horários, responsáveis ou orientações de acesso."
                />
              )}
            </form.Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </FieldSet>
  );

  const virtualFields = (
    <FieldSet>
      <FieldLegend>Recebimento das doações</FieldLegend>
      <FieldDescription>
        Informe pelo menos uma forma de transferência. O valor será enviado diretamente para os
        dados fornecidos.
      </FieldDescription>
      <FieldGroup>
        <form.Field name="pixKey">
          {(field) => (
            <TextField
              field={field}
              label="Chave PIX"
              placeholder="E-mail, CPF/CNPJ, telefone ou chave aleatória"
              description="Preencha este campo ou informe os dados bancários abaixo."
            />
          )}
        </form.Field>

        <form.Field name="bankAccountInfo">
          {(field) => (
            <TextAreaField
              field={field}
              label="Dados bancários"
              placeholder="Banco, agência, conta, tipo de conta e titular"
              description="Preencha este campo ou informe uma chave PIX acima."
            />
          )}
        </form.Field>
      </FieldGroup>
    </FieldSet>
  );

  return (
    <AppInset breadcrumbs={[{ label: 'Campanhas', href: '/campaigns' }, { label: 'Criar' }]}>
      <div className="flex w-full flex-col gap-5">
        {organizerProfileQuery.isPending && (
          <Loading description="Verificando perfil organizador" />
        )}

        {organizerProfileQuery.isError && (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Não foi possível verificar o perfil</AlertTitle>
            <AlertDescription>{organizerProfileQuery.error.message}</AlertDescription>
          </Alert>
        )}

        {organizerProfileQuery.data && !organizerProfileQuery.data.hasOrganizerProfile && (
          <Alert className="w-fit pb-14 has-data-[slot=alert-action]:pr-4">
            <IconAlertCircle />
            <AlertTitle>Perfil organizador obrigatório</AlertTitle>
            <AlertDescription>
              Configure um perfil organizador antes de criar campanhas. O formulário ficará
              disponível depois que o perfil for criado.
            </AlertDescription>
            <AlertAction className="top-auto bottom-3">
              <Button nativeButton={false} size="sm" render={<Link to="/organizer-profile" />}>
                Configurar perfil organizador
              </Button>
            </AlertAction>
          </Alert>
        )}

        {organizerProfileQuery.data?.hasOrganizerProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Criar campanha</CardTitle>
              <CardDescription>
                Apresente sua causa e informe como as pessoas poderão contribuir.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {mutation.isError && (
                <Alert variant="destructive">
                  <IconAlertCircle />
                  <AlertTitle>Não foi possível criar a campanha</AlertTitle>
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
                      Explique de forma objetiva a causa, o público beneficiado e a região atendida.
                    </FieldDescription>
                    <FieldGroup>
                      <form.Field name="title">
                        {(field) => (
                          <TextField
                            field={field}
                            label="Título"
                            placeholder="Ex: Alimentos para famílias"
                            required
                          />
                        )}
                      </form.Field>

                      <form.Field name="description">
                        {(field) => (
                          <TextAreaField
                            field={field}
                            label="Descrição"
                            placeholder="Descreva a causa, o objetivo e quem será beneficiado"
                            description="Inclua as informações necessárias para que os doadores entendam a campanha."
                            required
                          />
                        )}
                      </form.Field>

                      <div className="grid gap-4 md:grid-cols-2">
                        <form.Field name="category">
                          {(field) => (
                            <TextField
                              field={field}
                              label="Categoria"
                              placeholder="Ex: Alimentos"
                              description="Tema usado para encontrar a campanha."
                              required
                            />
                          )}
                        </form.Field>

                        <form.Field name="region">
                          {(field) => (
                            <TextField
                              field={field}
                              label="Região"
                              placeholder="Ex: São Paulo"
                              description="Cidade, estado ou região atendida."
                              required
                            />
                          )}
                        </form.Field>
                      </div>

                      <form.Field name="type">
                        {(field) => {
                          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <RequiredLabel htmlFor={field.name}>Tipo de campanha</RequiredLabel>
                              <Select
                                value={field.state.value}
                                onValueChange={(value) =>
                                  field.setValue(v.parse(campaignTypeSchema, value))
                                }
                              >
                                <SelectTrigger
                                  id={field.name}
                                  className="w-full"
                                  aria-invalid={isInvalid}
                                  aria-required="true"
                                >
                                  <SelectValue>
                                    {campaignTypeMetadata[field.state.value].label}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {campaignTypeValues.map((campaignType) => (
                                    <SelectItem key={campaignType} value={campaignType}>
                                      {campaignTypeMetadata[campaignType].formLabel}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FieldDescription>
                                Campanhas físicas recebem itens; campanhas virtuais recebem doações
                                diretamente na conta informada.
                              </FieldDescription>
                              {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                          );
                        }}
                      </form.Field>
                    </FieldGroup>
                  </FieldSet>

                  <FieldSet>
                    <FieldLegend>Período e imagem</FieldLegend>
                    <FieldDescription>
                      Defina quando a campanha estará ativa e, se desejar, envie uma imagem.
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
                              description="Deve ser posterior à data inicial."
                              required
                            />
                          )}
                        </form.Field>
                      </div>

                      <CampaignAssetUploadField
                        id="campaign-image"
                        label="Imagem da campanha"
                        description="Opcional. Envie uma imagem JPEG, PNG ou WebP; ela será otimizada antes do envio."
                        kind="IMAGE"
                        assets={imageUpload.assets}
                        maxCount={1}
                        disabled={mutation.isPending}
                        onFiles={imageUpload.addFiles}
                        onRemove={(key) => void imageUpload.removeAsset(key)}
                        onRetry={(key) => void imageUpload.retryAsset(key)}
                      />
                    </FieldGroup>
                  </FieldSet>

                  <form.Subscribe selector={(state) => state.values.type}>
                    {(type) => (isPhysicalCampaign(type) ? physicalFields : virtualFields)}
                  </form.Subscribe>
                </fieldset>
              </form>
            </CardContent>
            <CardFooter className="justify-end">
              <form.Subscribe selector={(state) => state.canSubmit}>
                {(canSubmit) => (
                  <Button
                    type="submit"
                    form={formId}
                    disabled={
                      !canSubmit ||
                      mutation.isPending ||
                      imageUpload.isBusy ||
                      imageUpload.hasErrors
                    }
                  >
                    {mutation.isPending ? <Spinner /> : <IconDeviceFloppy />}
                    {mutation.isPending ? 'Criando campanha...' : 'Criar campanha'}
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

type StringField = {
  name: string;
  state: {
    value: string | undefined;
    meta: { isTouched: boolean; isValid: boolean; errors: unknown[] };
  };
  handleBlur: () => void;
  setValue: (value: string) => void;
};

function TextField({
  field,
  label,
  placeholder,
  description,
  required,
  type,
}: {
  field: StringField;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  type?: React.ComponentProps<typeof Input>['type'];
}) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {required ? (
        <RequiredLabel htmlFor={field.name}>{label}</RequiredLabel>
      ) : (
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      )}
      <Input
        id={field.name}
        type={type}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(event) => field.setValue(event.target.value)}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        aria-required={required || undefined}
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
  field: StringField;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
}) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {required ? (
        <RequiredLabel htmlFor={field.name}>{label}</RequiredLabel>
      ) : (
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      )}
      <Textarea
        id={field.name}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(event) => field.setValue(event.target.value)}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        aria-required={required || undefined}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors as Array<{ message?: string }>} />}
    </Field>
  );
}

function RequiredLabel({ children, ...props }: React.ComponentProps<typeof FieldLabel>) {
  return (
    <FieldLabel {...props}>
      {children} <RequiredMark />
    </FieldLabel>
  );
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
