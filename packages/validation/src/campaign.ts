import { CampaignStatus, CampaignType } from '@lumos/database/generated/prisma/enums';
import * as v from 'valibot';

/**
 * Canonical persisted and API values for campaign behavior.
 * PHYSICAL campaigns collect items at collection points; VIRTUAL campaigns receive direct funds.
 */
export { CampaignStatus, CampaignType };

const requiredString = (message: string) => v.pipe(v.string(), v.trim(), v.nonEmpty(message));
const optionalString = v.optional(v.pipe(v.string(), v.trim()));
const requiredDate = (message: string) =>
  v.pipe(
    requiredString(message),
    v.check((value) => !value || isIsoDate(value), 'Informe uma data válida.'),
  );
const uploadIdSchema = v.pipe(v.string(), v.ulid('Upload inválido.'));
const operationKeySchema = v.pipe(v.string(), v.uuid('Chave de operação inválida.'));

export const CAMPAIGN_IMAGE_CONTENT_TYPE = 'image/webp';
export const CAMPAIGN_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const CAMPAIGN_EVIDENCE_MAX_SIZE_BYTES = 10 * 1024 * 1024;
export const CAMPAIGN_EVIDENCE_MAX_COUNT = 10;
export const CAMPAIGN_ASSET_UPLOAD_EXPIRES_IN_SECONDS = 5 * 60;
export const CAMPAIGN_EVIDENCE_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const;

const fileNameSchema = v.pipe(
  requiredString('Nome do arquivo é obrigatório.'),
  v.maxLength(255, 'O nome do arquivo deve ter no máximo 255 caracteres.'),
);

const contentLengthSchema = (maxSize: number, message: string) =>
  v.pipe(
    v.number('Tamanho do arquivo deve ser um número.'),
    v.integer('Tamanho do arquivo deve ser um número inteiro.'),
    v.minValue(1, 'O arquivo não pode estar vazio.'),
    v.maxValue(maxSize, message),
  );

export const campaignAssetUploadInputSchema = v.variant('kind', [
  v.object({
    kind: v.literal('IMAGE'),
    originalFileName: fileNameSchema,
    contentType: v.literal(CAMPAIGN_IMAGE_CONTENT_TYPE),
    contentLength: contentLengthSchema(
      CAMPAIGN_IMAGE_MAX_SIZE_BYTES,
      'A imagem deve ter no máximo 5 MB.',
    ),
  }),
  v.object({
    kind: v.literal('ACCOUNTABILITY_EVIDENCE'),
    campaignId: requiredString('Campanha é obrigatória.'),
    originalFileName: fileNameSchema,
    contentType: v.picklist(
      CAMPAIGN_EVIDENCE_CONTENT_TYPES,
      'Envie uma imagem JPEG, PNG ou WebP, ou um documento PDF.',
    ),
    contentLength: contentLengthSchema(
      CAMPAIGN_EVIDENCE_MAX_SIZE_BYTES,
      'Cada evidência deve ter no máximo 10 MB.',
    ),
  }),
]);

export const campaignAssetUploadIdInputSchema = v.object({ uploadId: uploadIdSchema });

// eslint-disable-next-line no-underscore-dangle -- Valibot intentionally names this API enum_.
export const campaignTypeSchema = v.enum_(CampaignType);

export const CAMPAIGN_LIST_DEFAULT_PAGE_SIZE = 12;
export const CAMPAIGN_LIST_MAX_PAGE_SIZE = 48;

const campaignListPageSizeSchema = v.pipe(
  v.number('O tamanho da página deve ser um número.'),
  v.integer('O tamanho da página deve ser um número inteiro.'),
  v.minValue(1, 'O tamanho da página deve ser pelo menos 1.'),
  v.maxValue(
    CAMPAIGN_LIST_MAX_PAGE_SIZE,
    `O tamanho da página não pode ser maior que ${CAMPAIGN_LIST_MAX_PAGE_SIZE}.`,
  ),
);

export const campaignListInputSchema = v.object({
  category: optionalString,
  region: optionalString,
  type: v.optional(campaignTypeSchema),
  cursor: v.optional(requiredString('Cursor inválido.')),
  limit: v.optional(campaignListPageSizeSchema, CAMPAIGN_LIST_DEFAULT_PAGE_SIZE),
});

export const campaignByIdInputSchema = v.object({
  id: requiredString('Campanha é obrigatória'),
});

export const campaignProgressUpdateInputSchema = v.object({
  id: requiredString('Campanha é obrigatória'),
  currentItems: v.pipe(
    v.number('A quantidade atual deve ser um número.'),
    v.integer('A quantidade atual deve ser um número inteiro.'),
    v.minValue(0, 'A quantidade atual não pode ser negativa.'),
    v.maxValue(2_147_483_647, 'A quantidade atual excede o limite permitido.'),
  ),
});

export const campaignLifecycleTransitionInputSchema = v.object({
  id: requiredString('Campanha é obrigatória'),
  status: v.picklist([CampaignStatus.COMPLETED, CampaignStatus.CANCELLED]),
});

const campaignIdInputEntry = {
  id: requiredString('Campanha é obrigatória'),
};

const accountabilityCommonInputEntries = {
  ...campaignIdInputEntry,
  outcomeSummary: requiredString('O resumo do resultado é obrigatório.'),
  retainedEvidenceAssetIds: v.pipe(
    v.array(uploadIdSchema),
    v.maxLength(CAMPAIGN_EVIDENCE_MAX_COUNT, 'Mantenha no máximo 10 evidências.'),
  ),
  evidenceUploadIds: v.pipe(
    v.array(uploadIdSchema),
    v.maxLength(CAMPAIGN_EVIDENCE_MAX_COUNT, 'Envie no máximo 10 evidências.'),
  ),
};

const physicalCampaignAccountabilityInputSchema = v.object({
  ...accountabilityCommonInputEntries,
  type: v.literal(CampaignType.PHYSICAL),
  totalItems: v.pipe(
    v.number('O total de itens deve ser um número.'),
    v.integer('O total de itens deve ser um número inteiro.'),
    v.minValue(0, 'O total de itens não pode ser negativo.'),
    v.maxValue(2_147_483_647, 'O total de itens excede o limite permitido.'),
  ),
});

const virtualCampaignAccountabilityInputSchema = v.object({
  ...accountabilityCommonInputEntries,
  type: v.literal(CampaignType.VIRTUAL),
  totalAmountCents: v.pipe(
    v.number('O total em BRL deve ser um número.'),
    v.integer('O total em BRL deve estar em centavos inteiros.'),
    v.minValue(0, 'O total em BRL não pode ser negativo.'),
    v.maxValue(2_147_483_647, 'O total em BRL excede o limite permitido.'),
  ),
});

export const campaignAccountabilityInputSchema = v.pipe(
  v.variant('type', [
    physicalCampaignAccountabilityInputSchema,
    virtualCampaignAccountabilityInputSchema,
  ]),
  v.check(
    (input) =>
      new Set([...input.retainedEvidenceAssetIds, ...input.evidenceUploadIds]).size ===
      input.retainedEvidenceAssetIds.length + input.evidenceUploadIds.length,
    'A mesma evidência não pode ser informada mais de uma vez.',
  ),
  v.check(
    (input) =>
      input.retainedEvidenceAssetIds.length + input.evidenceUploadIds.length <=
      CAMPAIGN_EVIDENCE_MAX_COUNT,
    'A prestação de contas deve ter no máximo 10 evidências.',
  ),
);

export const campaignCollectionPointInputSchema = v.object({
  name: requiredString('Nome do ponto de coleta é obrigatório'),
  address: requiredString('Endereço é obrigatório'),
  city: requiredString('Cidade é obrigatória'),
  state: requiredString('Estado é obrigatório'),
  zipCode: requiredString('CEP é obrigatório'),
  instructions: optionalString,
});

const campaignCollectionPointUpdateInputSchema = v.object({
  id: v.optional(requiredString('Identificador do ponto de coleta inválido.')),
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
  imageUploadId: v.optional(uploadIdSchema),
};

const campaignEditableCommonInputEntries = {
  title: requiredString('Título é obrigatório'),
  description: requiredString('Descrição é obrigatória'),
  category: requiredString('Categoria é obrigatória'),
  region: requiredString('Região é obrigatória'),
  startDate: requiredDate('Data inicial é obrigatória'),
  endDate: requiredDate('Data final é obrigatória'),
};

const physicalCampaignCreateInputSchema = v.object({
  ...campaignCommonInputEntries,
  type: v.literal(CampaignType.PHYSICAL),
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
  type: v.literal(CampaignType.VIRTUAL),
  pixKey: optionalString,
  bankAccountInfo: optionalString,
});

const campaignCreatePayloadInputSchema = v.pipe(
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
      (input) =>
        input.type !== CampaignType.VIRTUAL || Boolean(input.pixKey || input.bankAccountInfo),
      'Informe uma chave PIX ou os dados bancários.',
    ),
    ['pixKey'],
  ),
);

export const campaignCreateInputSchema = v.intersect([
  campaignCreatePayloadInputSchema,
  v.object({ operationKey: operationKeySchema }),
]);

export const campaignCreateFormInputSchema = campaignCreatePayloadInputSchema;

const physicalCampaignDetailsUpdateInputSchema = v.object({
  ...campaignIdInputEntry,
  ...campaignEditableCommonInputEntries,
  type: v.literal(CampaignType.PHYSICAL),
  location: requiredString('Local principal é obrigatório'),
  targetItems: v.pipe(
    v.number('Meta de itens é obrigatória'),
    v.integer('Meta de itens deve ser um número inteiro.'),
    v.minValue(1, 'Meta de itens deve ser maior que zero.'),
  ),
  collectionPoints: v.pipe(
    v.array(campaignCollectionPointUpdateInputSchema),
    v.minLength(1, 'Informe pelo menos um ponto de coleta.'),
  ),
});

const virtualCampaignDetailsUpdateInputSchema = v.object({
  ...campaignIdInputEntry,
  ...campaignEditableCommonInputEntries,
  type: v.literal(CampaignType.VIRTUAL),
  pixKey: optionalString,
  bankAccountInfo: optionalString,
});

export const campaignDetailsUpdateInputSchema = v.pipe(
  v.variant('type', [
    physicalCampaignDetailsUpdateInputSchema,
    virtualCampaignDetailsUpdateInputSchema,
  ]),
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
      (input) =>
        input.type !== CampaignType.VIRTUAL || Boolean(input.pixKey || input.bankAccountInfo),
      'Informe uma chave PIX ou os dados bancários.',
    ),
    ['pixKey'],
  ),
);

const campaignPublishUpdateInputEntries = {
  id: requiredString('Campanha é obrigatória'),
  message: v.pipe(
    requiredString('A mensagem da atualização é obrigatória'),
    v.maxLength(2_000, 'A mensagem deve ter no máximo 2.000 caracteres.'),
  ),
};

const campaignPublishUpdatePayloadInputSchema = v.object(campaignPublishUpdateInputEntries);

export const campaignPublishUpdateInputSchema = v.object({
  ...campaignPublishUpdateInputEntries,
  operationKey: operationKeySchema,
});

export const campaignPublishUpdateFormInputSchema = campaignPublishUpdatePayloadInputSchema;

export type CampaignListInput = v.InferOutput<typeof campaignListInputSchema>;
export type CampaignCreateInput = v.InferOutput<typeof campaignCreateInputSchema>;
export type CampaignDetailsUpdateInput = v.InferOutput<typeof campaignDetailsUpdateInputSchema>;
export type CampaignPublishUpdateInput = v.InferOutput<typeof campaignPublishUpdateInputSchema>;
export type CampaignProgressUpdateInput = v.InferOutput<typeof campaignProgressUpdateInputSchema>;
export type CampaignLifecycleTransitionInput = v.InferOutput<
  typeof campaignLifecycleTransitionInputSchema
>;
export type CampaignAccountabilityInput = v.InferOutput<typeof campaignAccountabilityInputSchema>;
export type CampaignAssetUploadInput = v.InferOutput<typeof campaignAssetUploadInputSchema>;

export function parseBrlAmountToCents(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;

  const [whole, fraction = ''] = normalized.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(cents) && cents <= 2_147_483_647 ? cents : null;
}

export function formatBrlCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

function isIsoDate(value: string): boolean {
  return v.ISO_DATE_REGEX.test(value);
}
