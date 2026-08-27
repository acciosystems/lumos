import { randomUUID } from 'node:crypto';

import { env } from '@lumos/env/email';
import { createLogger } from 'evlog';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  kind: string;
  idempotencyKey: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const deliveryId = randomUUID();
  const startedAt = Date.now();
  let response: Awaited<ReturnType<typeof resend.emails.send>>;

  try {
    response = await resend.emails.send(
      {
        from: env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.body,
        tags: [
          { name: 'delivery_id', value: deliveryId },
          { name: 'kind', value: options.kind },
        ],
      },
      { idempotencyKey: options.idempotencyKey },
    );
  } catch {
    emitHandoffFailure({
      deliveryId,
      kind: options.kind,
      startedAt,
      failureCode: 'transport_error',
      providerStatusCode: null,
    });
    throw new Error('Email provider could not be reached.');
  }

  if (response.error || !response.data?.id) {
    emitHandoffFailure({
      deliveryId,
      kind: options.kind,
      startedAt,
      providerStatusCode: response.error?.statusCode ?? null,
      failureCode: normalizeFailureCode(response.error?.name),
    });
    throw new Error('Email provider rejected the message.');
  }

  createLogger({
    service: 'lumos/email',
    emailDelivery: {
      deliveryId,
      kind: options.kind,
      stage: 'accepted',
      durationMs: Date.now() - startedAt,
    },
  }).emit();

  return { providerMessageId: response.data.id };
}

function emitHandoffFailure({
  deliveryId,
  kind,
  startedAt,
  failureCode,
  providerStatusCode,
}: {
  deliveryId: string;
  kind: SendEmailOptions['kind'];
  startedAt: number;
  failureCode: string;
  providerStatusCode: number | null;
}) {
  const logger = createLogger({
    service: 'lumos/email',
    emailDelivery: {
      deliveryId,
      kind,
      stage: 'handoff_failed',
      durationMs: Date.now() - startedAt,
      providerStatusCode,
      failureCode,
    },
  });
  logger.setLevel('error');
  logger.emit({ _forceKeep: true });
}

function normalizeFailureCode(value?: string) {
  const normalized = (value ?? 'invalid_provider_response')
    .toLowerCase()
    .replaceAll(/[^a-z0-9_]+/g, '_')
    .slice(0, 80);
  return normalized || 'unknown';
}
