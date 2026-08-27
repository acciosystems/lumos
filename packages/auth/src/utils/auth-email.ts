import { createHash } from 'node:crypto';

import { sendEmail, type SendEmailOptions } from '@lumos/email';
import { APIError } from 'better-auth/api';

export const AUTH_EMAIL_EXPIRES_IN_SECONDS = 60 * 60;

interface AuthEmailOptions extends SendEmailOptions {
  kind: 'password_reset' | 'email_verification';
}

export async function sendAuthEmail(options: AuthEmailOptions) {
  try {
    await sendEmail(options);
  } catch {
    throw APIError.from('SERVICE_UNAVAILABLE', {
      code: 'EMAIL_HANDOFF_FAILED',
      message: 'Não foi possível enviar o e-mail agora. Tente novamente em alguns instantes.',
    });
  }
}

export function emailIdempotencyKey(kind: string, token: string) {
  const tokenHash = createHash('sha256').update(token).digest('hex');
  return `${kind}/${tokenHash}`;
}
