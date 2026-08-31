import * as v from 'valibot';

const requiredString = (message: string) => v.pipe(v.string(), v.trim(), v.nonEmpty(message));
const optionalString = v.optional(v.pipe(v.string(), v.trim()));
const limitedRequiredString = (requiredMessage: string, maxLength: number, maxMessage: string) =>
  v.pipe(requiredString(requiredMessage), v.maxLength(maxLength, maxMessage));
const limitedOptionalString = (maxLength: number, maxMessage: string) =>
  v.optional(v.pipe(v.string(), v.trim(), v.maxLength(maxLength, maxMessage)));

export const ORGANIZER_DISPLAY_NAME_MAX_LENGTH = 120;
export const ORGANIZER_BIO_MAX_LENGTH = 1_000;
export const ORGANIZER_WEBSITE_URL_MAX_LENGTH = 2_048;

export const organizerTypeSchema = v.picklist(['INDIVIDUAL', 'ORGANIZATION']);

export const organizerProfileUpsertInputSchema = v.pipe(
  v.object({
    type: organizerTypeSchema,
    displayName: limitedRequiredString(
      'Nome de exibição é obrigatório',
      ORGANIZER_DISPLAY_NAME_MAX_LENGTH,
      'O nome de exibição deve ter no máximo 120 caracteres.',
    ),
    bio: limitedOptionalString(
      ORGANIZER_BIO_MAX_LENGTH,
      'A apresentação deve ter no máximo 1.000 caracteres.',
    ),
    websiteUrl: limitedOptionalString(
      ORGANIZER_WEBSITE_URL_MAX_LENGTH,
      'O site deve ter no máximo 2.048 caracteres.',
    ),
    cnpj: optionalString,
  }),
  v.check(
    (value) => value.type !== 'ORGANIZATION' || isValidCnpj(value.cnpj ?? ''),
    'Organizações precisam de um CNPJ válido.',
  ),
  v.check(
    (value) => !value.websiteUrl || isHttpUrl(value.websiteUrl),
    'Informe uma URL válida com http:// ou https://.',
  ),
);

export type OrganizerProfileUpsertInput = v.InferOutput<typeof organizerProfileUpsertInputSchema>;

export function normalizeCnpj(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCnpj(value: string): string {
  const cnpj = normalizeCnpj(value);
  return cnpj.length === 14
    ? cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
    : cnpj;
}

export function isValidCnpj(value: string): boolean {
  const cnpj = normalizeCnpj(value);
  if (!/^\d{14}$/.test(cnpj) || /^(\d)\1{13}$/.test(cnpj)) return false;

  const calculateDigit = (length: number) => {
    let sum = 0;
    let weight = length - 7;

    for (let index = 0; index < length; index += 1) {
      sum += Number(cnpj[index]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  return calculateDigit(12) === Number(cnpj[12]) && calculateDigit(13) === Number(cnpj[13]);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
