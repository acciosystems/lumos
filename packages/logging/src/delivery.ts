import { waitUntil } from '@vercel/functions';
import type { DrainContext, WideEvent } from 'evlog';

const AXIOM_DELIVERY_TIMEOUT_MS = 2_000;

type DeliveryFailureCode = 'http_error' | 'network_error' | 'partial_rejection' | 'timeout';

type DeliveryOverrides = {
  fetch?: FetchLike;
  timeoutMs?: number;
};

type IngestResponse = {
  failed?: number;
};

type WaitUntil = (promise: Promise<unknown>) => unknown;
type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

async function getAxiomEnv() {
  const { env } = await import('@lumos/env/logging');
  return env;
}

function reportDropped(
  events: WideEvent[],
  failureCode: DeliveryFailureCode,
  options: { droppedCount?: number; statusCode?: number } = {},
) {
  const firstEvent = events[0] as Record<string, unknown> | undefined;

  // oxlint-disable-next-line no-console -- stderr is the independent fallback when Axiom is unavailable.
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      service: 'lumos/logging',
      event: 'logging_delivery_dropped',
      droppedCount: options.droppedCount ?? events.length,
      sourceService: firstEvent?.service,
      eventId: firstEvent?.eventId,
      requestId: firstEvent?.requestId,
      failureCode,
      statusCode: options.statusCode,
    }),
  );
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError';
}

async function readIngestResponse(response: Response): Promise<IngestResponse | undefined> {
  const body = await response.text();
  if (!body) return undefined;

  try {
    const parsed = JSON.parse(body) as unknown;
    if (!parsed || typeof parsed !== 'object') return undefined;
    return parsed as IngestResponse;
  } catch {
    return undefined;
  }
}

async function deliverEvents(events: WideEvent[], overrides: DeliveryOverrides = {}) {
  if (events.length === 0) return;

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    overrides.timeoutMs ?? AXIOM_DELIVERY_TIMEOUT_MS,
  );

  try {
    const env = await getAxiomEnv();
    const baseUrl = (env.AXIOM_URL ?? 'https://api.axiom.co').replace(/\/+$/, '');
    const response = await (overrides.fetch ?? globalThis.fetch)(
      `${baseUrl}/v1/datasets/${encodeURIComponent(env.AXIOM_DATASET)}/ingest`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.AXIOM_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'lumos/evlog',
        },
        body: JSON.stringify(events),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      reportDropped(events, 'http_error', { statusCode: response.status });
      return;
    }

    const result = await readIngestResponse(response);
    if (typeof result?.failed === 'number' && result.failed > 0) {
      reportDropped(events, 'partial_rejection', { droppedCount: result.failed });
    }
  } catch (error) {
    reportDropped(events, isAbortError(error) ? 'timeout' : 'network_error');
  } finally {
    clearTimeout(timeout);
  }
}

export async function deliverToAxiom(ctx: DrainContext, overrides?: DeliveryOverrides) {
  await deliverEvents([ctx.event], overrides);
}

export function registerDeliveryLifetime(promise: Promise<unknown>) {
  return waitUntil(promise);
}

export function scheduleAxiomDelivery(
  event: WideEvent | null,
  register: WaitUntil = registerDeliveryLifetime,
  overrides?: DeliveryOverrides,
) {
  if (!event) return undefined;

  const delivery = deliverEvents([event], overrides);
  register(delivery);
  return delivery;
}
