import { scheduleAxiomDelivery } from '@lumos/logging/delivery';
import { createLogger } from 'evlog';

import { auth } from './auth';
import { classifyAuthRateLimitEndpoint, type AuthRateLimitEndpoint } from './rate-limit';

export type AuthRateLimitMetric = {
  endpoint: AuthRateLimitEndpoint;
  method: string;
  outcome: 'blocked';
  retryAfterSeconds: number | null;
};

type AuthRequestHandler = (request: Request) => Promise<Response>;
type EmitRateLimitMetric = (metric: AuthRateLimitMetric) => void;

function emitAuthRateLimitMetric(metric: AuthRateLimitMetric) {
  // Observability must never turn a valid rate-limit response into an application error.
  try {
    scheduleAxiomDelivery(
      createLogger({
        service: 'lumos/auth',
        event: 'auth_rate_limit_exceeded',
        authRateLimit: metric,
      }).emit(),
    );
  } catch {
    // The response remains authoritative when telemetry is unavailable.
  }
}

export function createAuthHandler(
  handler: AuthRequestHandler,
  emitRateLimitMetric: EmitRateLimitMetric = emitAuthRateLimitMetric,
): AuthRequestHandler {
  return async (request) => {
    const response = await handler(request);
    if (response.status !== 429) return response;

    const retryAfter = response.headers.get('X-Retry-After');
    const parsedRetryAfter = retryAfter === null ? Number.NaN : Number.parseInt(retryAfter, 10);
    const retryAfterSeconds = Number.isFinite(parsedRetryAfter) ? parsedRetryAfter : null;
    const headers = new Headers(response.headers);

    if (retryAfterSeconds !== null) headers.set('Retry-After', retryAfterSeconds.toString());

    emitRateLimitMetric({
      endpoint: classifyAuthRateLimitEndpoint(new URL(request.url).pathname),
      method: request.method,
      outcome: 'blocked',
      retryAfterSeconds,
    });

    return new Response(response.body, {
      headers,
      status: response.status,
      statusText: response.statusText,
    });
  };
}

export const authHandler = createAuthHandler(auth.handler);
