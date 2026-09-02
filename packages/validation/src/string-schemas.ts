import * as v from 'valibot';

export function requiredTrimmedString(message: string) {
  return v.pipe(v.string(), v.trim(), v.nonEmpty(message));
}

export function optionalTrimmedString() {
  return v.optional(v.pipe(v.string(), v.trim()));
}

export function limitedRequiredTrimmedString(
  requiredMessage: string,
  maxLength: number,
  maxMessage: string,
) {
  return v.pipe(requiredTrimmedString(requiredMessage), v.maxLength(maxLength, maxMessage));
}

export function limitedOptionalTrimmedString(maxLength: number, maxMessage: string) {
  return v.optional(v.pipe(v.string(), v.trim(), v.maxLength(maxLength, maxMessage)));
}
