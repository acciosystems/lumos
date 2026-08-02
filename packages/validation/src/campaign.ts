import * as v from 'valibot';

const requiredString = (message: string) => v.pipe(v.string(), v.trim(), v.nonEmpty(message));
const optionalString = v.optional(v.pipe(v.string(), v.trim()));

export const campaignTypeSchema = v.picklist(['PHYSICAL', 'VIRTUAL']);

export const campaignListInputSchema = v.object({
  category: optionalString,
  region: optionalString,
  type: v.optional(campaignTypeSchema),
});

export const campaignByIdInputSchema = v.object({
  id: requiredString('Campanha é obrigatória'),
});

export const campaignCollectionPointInputSchema = v.object({
  name: requiredString('Nome do ponto de coleta é obrigatório'),
  address: requiredString('Endereço é obrigatório'),
  city: requiredString('Cidade é obrigatória'),
  state: requiredString('Estado é obrigatório'),
  zipCode: requiredString('CEP é obrigatório'),
  instructions: optionalString,
});

export const campaignCreateInputSchema = v.object({
  title: requiredString('Título é obrigatório'),
  description: requiredString('Descrição é obrigatória'),
  type: campaignTypeSchema,
  category: requiredString('Categoria é obrigatória'),
  region: requiredString('Região é obrigatória'),
  startDate: requiredString('Data inicial é obrigatória'),
  endDate: requiredString('Data final é obrigatória'),
  imageUrl: optionalString,
  location: optionalString,
  targetItems: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  pixKey: optionalString,
  bankAccountInfo: optionalString,
  collectionPoints: v.optional(v.array(campaignCollectionPointInputSchema)),
});

export type CampaignListInput = v.InferOutput<typeof campaignListInputSchema>;
export type CampaignCreateInput = v.InferOutput<typeof campaignCreateInputSchema>;
