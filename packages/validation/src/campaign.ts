import * as v from 'valibot';

const requiredString = (message: string) => v.pipe(v.string(), v.trim(), v.nonEmpty(message));
const optionalString = v.optional(v.pipe(v.string(), v.trim()));
const requiredDate = (message: string) =>
  v.pipe(
    requiredString(message),
    v.check((value) => !value || isIsoDate(value), 'Informe uma data válida.'),
  );
const optionalHttpUrl = v.optional(
  v.pipe(
    v.string(),
    v.trim(),
    v.check(
      (value) => !value || isHttpUrl(value),
      'Informe uma URL válida com http:// ou https://.',
    ),
  ),
);

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

const campaignCommonInputEntries = {
  title: requiredString('Título é obrigatório'),
  description: requiredString('Descrição é obrigatória'),
  category: requiredString('Categoria é obrigatória'),
  region: requiredString('Região é obrigatória'),
  startDate: requiredDate('Data inicial é obrigatória'),
  endDate: requiredDate('Data final é obrigatória'),
  imageUrl: optionalHttpUrl,
};

const physicalCampaignCreateInputSchema = v.object({
  ...campaignCommonInputEntries,
  type: v.literal('PHYSICAL'),
  location: requiredString('Local principal é obrigatório'),
  targetItems: v.pipe(
    v.number('Meta de itens é obrigatória'),
    v.integer('Meta de itens deve ser um número inteiro.'),
    v.minValue(1, 'Meta de itens deve ser maior que zero.'),
  ),
  collectionPoints: v.pipe(
    v.array(campaignCollectionPointInputSchema),
    v.minLength(1, 'Informe pelo menos um ponto de coleta.'),
  ),
});

const virtualCampaignCreateInputSchema = v.object({
  ...campaignCommonInputEntries,
  type: v.literal('VIRTUAL'),
  pixKey: optionalString,
  bankAccountInfo: optionalString,
});

export const campaignCreateInputSchema = v.pipe(
  v.variant('type', [physicalCampaignCreateInputSchema, virtualCampaignCreateInputSchema]),
  v.forward(
    v.check(
      (input) =>
        !isIsoDate(input.startDate) || !isIsoDate(input.endDate) || input.endDate > input.startDate,
      'Data final deve ser posterior à data inicial.',
    ),
    ['endDate'],
  ),
  v.forward(
    v.check(
      (input) => input.type !== 'VIRTUAL' || Boolean(input.pixKey || input.bankAccountInfo),
      'Informe uma chave PIX ou os dados bancários.',
    ),
    ['pixKey'],
  ),
);

export type CampaignListInput = v.InferOutput<typeof campaignListInputSchema>;
export type CampaignCreateInput = v.InferOutput<typeof campaignCreateInputSchema>;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isIsoDate(value: string): boolean {
  return v.ISO_DATE_REGEX.test(value);
}
