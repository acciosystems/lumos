import { randomUUID } from 'node:crypto';

import { env } from '@lumos/env/email';
import { scheduleAxiomDelivery } from '@lumos/logging/delivery';
import {
  assertForegroundDeadline,
  combineOperationSignal,
  getActiveRequestDeadline,
} from '@lumos/request-deadline';
import { createLogger } from 'evlog';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);
const RESEND_HANDOFF_TIMEOUT_MS = 5_000;

export interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  kind: string;
  idempotencyKey: string;
}

export async function sendEmail(options: SendEmailOptions, signal?: AbortSignal) {
  const deliveryId = randomUUID();
  const startedAt = Date.now();
  const deadline = getActiveRequestDeadline();
  assertActiveForegroundDeadline(deadline, 'email_before_handoff');
  const requestSignal = combineSignals(signal, deadline?.foregroundSignal);
  const handoffSignal = combineOperationSignal(requestSignal, RESEND_HANDOFF_TIMEOUT_MS);
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
      // Resend forwards untyped RequestInit fields to fetch. Its public type
      // does not expose signal yet, so keep the cast localized here.
      { idempotencyKey: options.idempotencyKey, signal: handoffSignal } as Parameters<
        typeof resend.emails.send
      >[1] & { signal: AbortSignal },
    );
  } catch {
    assertActiveForegroundDeadline(deadline, 'email_handoff');
    emitHandoffFailure({
      deliveryId,
      kind: options.kind,
      startedAt,
      failureCode: handoffSignal.aborted ? 'timeout' : 'transport_error',
      providerStatusCode: null,
    });
    throw new Error('Email provider could not be reached.');
  }

  if (handoffSignal.aborted || response.error || !response.data?.id) {
    assertActiveForegroundDeadline(deadline, 'email_after_handoff');
    emitHandoffFailure({
      deliveryId,
      kind: options.kind,
      startedAt,
      providerStatusCode: response.error?.statusCode ?? null,
      failureCode: handoffSignal.aborted ? 'timeout' : normalizeFailureCode(response.error?.name),
    });
    throw new Error('Email provider rejected the message.');
  }

  assertActiveForegroundDeadline(deadline, 'email_after_handoff');

  scheduleAxiomDelivery(
    createLogger({
      service: 'lumos/email',
      emailDelivery: {
        deliveryId,
        kind: options.kind,
        stage: 'accepted',
        durationMs: Date.now() - startedAt,
      },
    }).emit(),
  );

  return { providerMessageId: response.data.id };
}

function combineSignals(...signals: Array<AbortSignal | undefined>) {
  const availableSignals = signals.filter((signal): signal is AbortSignal => signal !== undefined);
  if (availableSignals.length === 0) return undefined;
  return availableSignals.length === 1 ? availableSignals[0] : AbortSignal.any(availableSignals);
}

function assertActiveForegroundDeadline(
  deadline: ReturnType<typeof getActiveRequestDeadline>,
  stage: string,
) {
  if (deadline) assertForegroundDeadline(deadline, stage);
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
  scheduleAxiomDelivery(logger.emit({ _forceKeep: true }));
}

function normalizeFailureCode(value?: string) {
  const normalized = (value ?? 'invalid_provider_response')
    .toLowerCase()
    .replaceAll(/[^a-z0-9_]+/g, '_')
    .slice(0, 80);
  return normalized || 'unknown';
}
