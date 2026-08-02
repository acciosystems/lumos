import { campaignCreateInputSchema } from '@lumos/validation/campaign';
import { IconAlertCircle, IconDeviceFloppy } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

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

export const Route = createFileRoute('/(app)/campaigns/new')({
  loader: () => ({ breadcrumb: [{ label: 'Campanhas', href: '/campaigns' }, { label: 'Criar' }] }),
  component: NewCampaignPage,
});

type CampaignType = 'PHYSICAL' | 'VIRTUAL';
type CampaignCreateInput = v.InferOutput<typeof campaignCreateInputSchema>;

const requiredString = (message: string) => v.pipe(v.string(), v.trim(), v.nonEmpty(message));

const formSchema = v.pipe(
  v.object({
    title: requiredString('Título é obrigatório'),
    description: requiredString('Descrição é obrigatória'),
    type: v.picklist(['PHYSICAL', 'VIRTUAL']),
    category: requiredString('Tema é obrigatório'),
    region: requiredString('Região é obrigatória'),
    startDate: requiredString('Data inicial é obrigatória'),
    endDate: requiredString('Data final é obrigatória'),
    imageUrl: v.string(),
    location: v.string(),
    targetItems: v.pipe(v.number(), v.integer(), v.minValue(1)),
    pixKey: v.string(),
    bankAccountInfo: v.string(),
    collectionPoints: v.array(
      v.object({
        name: v.string(),
        address: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        instructions: v.string(),
      }),
    ),
  }),
  v.check(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    'Data final deve ser posterior ao início',
  ),
);

type CampaignFormValue = v.InferOutput<typeof formSchema>;
const defaultValues: CampaignFormValue = {
  title: '',
  description: '',
  type: 'PHYSICAL',
  category: '',
  region: '',
  startDate: '',
  endDate: '',
  imageUrl: '',
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

  const [errors, setErrors] = useState<string[]>([]);

  const organizerProfileQuery = useQuery({
    queryKey: ['campaign-organizer-profile'],
    queryFn: async () => await rpc.campaign.canCreate.call(),
  });

  const mutation = useMutation({
    mutationFn: async (input: CampaignCreateInput) => await rpc.campaign.create.call(input),
    onSuccess: async (campaign) => {
      await queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      toast.success('Campanha criada com sucesso');
      navigate({ to: '/campaigns/$id', params: { id: campaign.id } });
    },
    onError: (error) => {
      const message = error.message || String(error);
      toast.error('Falha ao criar campanha', { description: message });
    },
  });

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      setErrors([]);

      const result = validateCreateInput(value);
      if (!result.success) {
        setErrors(result.errors);
        return;
      }

      mutation.mutate(result.input);
    },
  });

  const physicalFields = (
    <FieldGroup>
      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="location">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Local principal</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.setValue(event.target.value)}
                placeholder="Ex: Centro comunitário"
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="targetItems">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Meta de itens</FieldLabel>
              <Input
                id={field.name}
                type="number"
                min={1}
                step={1}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.setValue(Number(event.target.value))}
              />
            </Field>
          )}
        </form.Field>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-4 font-heading text-base font-medium">Ponto de coleta</h2>
        <div className="grid gap-4">
          <form.Field name="collectionPoints[0].name">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.setValue(event.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="collectionPoints[0].address">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Endereço</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.setValue(event.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <div className="grid gap-4 md:grid-cols-3">
            <form.Field name="collectionPoints[0].city">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Cidade</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.setValue(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="collectionPoints[0].state">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.setValue(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="collectionPoints[0].zipCode">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>CEP</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.setValue(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>
          </div>

          <form.Field name="collectionPoints[0].instructions">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Instruções</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.setValue(event.target.value)}
                />
              </Field>
            )}
          </form.Field>
        </div>
      </div>
    </FieldGroup>
  );

  const virtualFields = (
    <FieldGroup>
      <form.Field name="pixKey">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Chave PIX</FieldLabel>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.setValue(event.target.value)}
              placeholder="email, CPF/CNPJ, telefone ou chave aleatória"
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="bankAccountInfo">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Dados bancários</FieldLabel>
            <Textarea
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.setValue(event.target.value)}
            />
            <FieldDescription>Informe chave PIX, dados bancários, ou ambos.</FieldDescription>
            <FieldError />
          </Field>
        )}
      </form.Field>
    </FieldGroup>
  );

  return (
    <AppInset breadcrumbs={[{ label: 'Campanhas', href: '/campaigns' }, { label: 'Criar' }]}>
      {organizerProfileQuery.isPending && <Loading description="Verificando perfil organizador" />}

      {organizerProfileQuery.isError && (
        <Alert variant="destructive">
          <IconAlertCircle />
          <AlertTitle>Não foi possível verificar o perfil</AlertTitle>
          <AlertDescription>{organizerProfileQuery.error.message}</AlertDescription>
        </Alert>
      )}

      {organizerProfileQuery.data && !organizerProfileQuery.data.hasOrganizerProfile && (
        <Alert>
          <IconAlertCircle />
          <AlertTitle>Perfil organizador obrigatório</AlertTitle>
          <AlertDescription>
            Configure um perfil organizador antes de criar campanhas. O formulário ficará disponível
            depois que o perfil for criado.
          </AlertDescription>
        </Alert>
      )}

      {organizerProfileQuery.data?.hasOrganizerProfile && (
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Criar campanha</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                id={formId}
                className="space-y-7"
                onSubmit={(event) => {
                  event.preventDefault();
                  form.handleSubmit();
                }}
              >
                {errors.length > 0 && (
                  <Alert variant="destructive">
                    <IconAlertCircle />
                    <AlertTitle>Revise os campos</AlertTitle>
                    <AlertDescription>{errors.join(' ')}</AlertDescription>
                  </Alert>
                )}

                <FieldGroup>
                  <div className="grid gap-4 md:grid-cols-2">
                    <form.Field name="title">
                      {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Título</FieldLabel>
                            <Input
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) => field.setValue(event.target.value)}
                              aria-invalid={isInvalid}
                              placeholder="Ex: Alimentos para famílias"
                            />
                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                          </Field>
                        );
                      }}
                    </form.Field>

                    <form.Field name="type">
                      {(field) => (
                        <Field>
                          <FieldLabel>Tipo</FieldLabel>
                          <Select
                            value={field.state.value}
                            onValueChange={(value) => field.setValue(value as CampaignType)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PHYSICAL">Física</SelectItem>
                              <SelectItem value="VIRTUAL">Virtual</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    </form.Field>
                  </div>

                  <form.Field name="description">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Descrição</FieldLabel>
                          <Textarea
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.setValue(event.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Descreva a causa, o objetivo e quem será beneficiado"
                          />
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <form.Field name="category">
                      {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Tema</FieldLabel>
                            <Input
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) => field.setValue(event.target.value)}
                              aria-invalid={isInvalid}
                              placeholder="Ex: alimentos"
                            />
                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                          </Field>
                        );
                      }}
                    </form.Field>

                    <form.Field name="region">
                      {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Região</FieldLabel>
                            <Input
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) => field.setValue(event.target.value)}
                              aria-invalid={isInvalid}
                              placeholder="Ex: São Paulo"
                            />
                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                          </Field>
                        );
                      }}
                    </form.Field>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <form.Field name="startDate">
                      {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Início</FieldLabel>
                            <Input
                              id={field.name}
                              type="date"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) => field.setValue(event.target.value)}
                              aria-invalid={isInvalid}
                            />
                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                          </Field>
                        );
                      }}
                    </form.Field>

                    <form.Field name="endDate">
                      {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Fim</FieldLabel>
                            <Input
                              id={field.name}
                              type="date"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) => field.setValue(event.target.value)}
                              aria-invalid={isInvalid}
                            />
                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                          </Field>
                        );
                      }}
                    </form.Field>
                  </div>

                  <form.Field name="imageUrl">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Imagem</FieldLabel>
                        <Input
                          id={field.name}
                          type="url"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.setValue(event.target.value)}
                          placeholder="https://..."
                        />
                        <FieldDescription>Opcional.</FieldDescription>
                      </Field>
                    )}
                  </form.Field>
                </FieldGroup>

                <form.Subscribe selector={(state) => state.values.type}>
                  {(type) => (type === 'PHYSICAL' ? physicalFields : virtualFields)}
                </form.Subscribe>
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
                    {mutation.isPending ? <Spinner /> : <IconDeviceFloppy />}
                    Criar campanha
                  </Button>
                )}
              </form.Subscribe>
            </CardFooter>
          </Card>
        </div>
      )}
    </AppInset>
  );
}

function validateCreateInput(value: CampaignFormValue) {
  const input = toCampaignCreateInput(value);
  const result = v.safeParse(campaignCreateInputSchema, input);
  if (!result.success) return { success: false as const, errors: getIssueMessages(result.issues) };

  if (input.type === 'PHYSICAL' && (!input.location || !input.targetItems)) {
    return {
      success: false as const,
      errors: ['Campanhas físicas precisam de local e meta de itens.'],
    };
  }

  if (input.type === 'VIRTUAL' && !input.pixKey && !input.bankAccountInfo) {
    return {
      success: false as const,
      errors: ['Campanhas virtuais precisam de chave PIX ou dados bancários.'],
    };
  }

  return { success: true as const, input: result.output };
}

function toCampaignCreateInput(value: CampaignFormValue): CampaignCreateInput {
  return {
    title: value.title,
    description: value.description,
    type: value.type,
    category: value.category,
    region: value.region,
    startDate: value.startDate,
    endDate: value.endDate,
    imageUrl: value.imageUrl,
    location: value.type === 'PHYSICAL' ? value.location : '',
    targetItems: value.type === 'PHYSICAL' ? value.targetItems : undefined,
    pixKey: value.type === 'VIRTUAL' ? value.pixKey : '',
    bankAccountInfo: value.type === 'VIRTUAL' ? value.bankAccountInfo : '',
    collectionPoints: value.type === 'PHYSICAL' ? value.collectionPoints : undefined,
  };
}

function getIssueMessages(issues: v.InferIssue<typeof campaignCreateInputSchema>[]) {
  return [...new Set(issues.map((issue) => issue.message))];
}
