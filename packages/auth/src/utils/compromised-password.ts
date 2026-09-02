import { createHash } from 'node:crypto';

import type { AuthContext } from '@better-auth/core';
import { getCurrentAuthContext } from '@better-auth/core/context';
import { scheduleAxiomDelivery } from '@lumos/logging/delivery';
import {
  assertForegroundDeadline,
  combineOperationSignal,
  getActiveRequestDeadline,
} from '@lumos/request-deadline';
import { APIError } from 'better-auth/api';
import { hashPassword } from 'better-auth/crypto';
import { createLogger } from 'evlog';

const PWNED_PASSWORDS_TIMEOUT_MS = 2_000;
const PWNED_PASSWORDS_API_URL = 'https://api.pwnedpasswords.com/range';
const PASSWORD_COMPROMISE_CHECK_PATHS = new Set([
  '/sign-up/email',
  '/change-password',
  '/reset-password',
  '/email-otp/reset-password',
  '/phone-number/reset-password',
  '/admin/create-user',
  '/admin/set-user-password',
]);

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
type PasswordHasher = (password: string) => Promise<string>;

export type PasswordCompromiseCheckFailure = {
  outcome: 'timeout' | 'transport_error' | 'http_error' | 'malformed_response';
  durationMs: number;
  providerStatusCode: number | null;
};

type PasswordCompromiseCheckResult =
  | { status: 'clear' }
  | { status: 'compromised' }
  | { status: 'unavailable'; failure: PasswordCompromiseCheckFailure };

type CompromisedPasswordHasherOptions = {
  fetch?: FetchLike;
  hash?: PasswordHasher;
  onFailure?: (failure: PasswordCompromiseCheckFailure) => void;
  timeoutMs?: number;
};

function getPasswordHashParts(password: string) {
  const passwordHash = createHash('sha1').update(password).digest('hex').toUpperCase();

  return {
    prefix: passwordHash.slice(0, 5),
    suffix: passwordHash.slice(5),
  };
}

function matchesCompromisedSuffix(body: string, suffix: string): boolean | undefined {
  const lines = body.split(/\r?\n/u);
  if (lines.at(-1) === '') lines.pop();

  if (lines.length === 0 || lines.some((line) => !/^[0-9A-F]{35}:\d+$/iu.test(line))) {
    return undefined;
  }

  return lines.some((line) => line.slice(0, 35).toUpperCase() === suffix);
}

export async function checkPasswordCompromise(
  password: string,
  {
    fetch = globalThis.fetch,
    timeoutMs = PWNED_PASSWORDS_TIMEOUT_MS,
  }: Pick<CompromisedPasswordHasherOptions, 'fetch' | 'timeoutMs'> = {},
): Promise<PasswordCompromiseCheckResult> {
  const { prefix, suffix } = getPasswordHashParts(password);
  const startedAt = Date.now();
  const deadline = getActiveRequestDeadline();
  assertActiveForegroundDeadline(deadline, 'auth_hibp_before_request');
  const signal = combineOperationSignal(deadline?.foregroundSignal, timeoutMs);

  try {
    const response = await fetch(`${PWNED_PASSWORDS_API_URL}/${prefix}`, {
      headers: {
        'Add-Padding': 'true',
        'User-Agent': 'Lumos Password Checker',
      },
      signal,
    });
    assertActiveForegroundDeadline(deadline, 'auth_hibp_after_request');

    if (!response.ok) {
      return {
        status: 'unavailable',
        failure: {
          outcome: 'http_error',
          durationMs: Date.now() - startedAt,
          providerStatusCode: response.status,
        },
      };
    }

    const compromised = matchesCompromisedSuffix(await response.text(), suffix);
    assertActiveForegroundDeadline(deadline, 'auth_hibp_after_request');
    if (compromised === undefined) {
      return {
        status: 'unavailable',
        failure: {
          outcome: 'malformed_response',
          durationMs: Date.now() - startedAt,
          providerStatusCode: response.status,
        },
      };
    }

    return { status: compromised ? 'compromised' : 'clear' };
  } catch {
    assertActiveForegroundDeadline(deadline, 'auth_hibp_request');
    return {
      status: 'unavailable',
      failure: {
        outcome: signal.aborted ? 'timeout' : 'transport_error',
        durationMs: Date.now() - startedAt,
        providerStatusCode: null,
      },
    };
  }
}

function assertActiveForegroundDeadline(
  deadline: ReturnType<typeof getActiveRequestDeadline>,
  stage: string,
) {
  if (deadline) assertForegroundDeadline(deadline, stage);
}

function emitPasswordCompromiseCheckFailure(failure: PasswordCompromiseCheckFailure) {
  // Observability must not change password-setting behavior when its own delivery is unavailable.
  try {
    const logger = createLogger({
      service: 'lumos/auth',
      event: 'auth_password_compromise_check_failed',
      passwordCompromiseCheck: failure,
    });
    logger.setLevel('error');
    scheduleAxiomDelivery(logger.emit({ _forceKeep: true }));
  } catch {
    // The password operation remains authoritative when telemetry is unavailable.
  }
}

export function createCompromisedPasswordHasher({
  fetch,
  hash = hashPassword,
  onFailure = emitPasswordCompromiseCheckFailure,
  timeoutMs,
}: CompromisedPasswordHasherOptions = {}): PasswordHasher {
  return async (password) => {
    const result = await checkPasswordCompromise(password, { fetch, timeoutMs });

    if (result.status === 'compromised') {
      throw APIError.from('BAD_REQUEST', {
        code: 'PASSWORD_COMPROMISED',
        message: 'Esta senha apareceu em vazamentos. Escolha uma senha diferente.',
      });
    }

    if (result.status === 'unavailable') onFailure(result.failure);

    return await hash(password);
  };
}

export function isPasswordCompromiseCheckPath(path: string | undefined) {
  return path !== undefined && PASSWORD_COMPROMISE_CHECK_PATHS.has(path);
}

export function boundedHaveIBeenPwned() {
  return {
    id: 'bounded-have-i-been-pwned',
    init(ctx: AuthContext) {
      const originalHash = ctx.password.hash;
      const hashWithCompromiseCheck = createCompromisedPasswordHasher({ hash: originalHash });

      return {
        context: {
          password: {
            ...ctx.password,
            async hash(password: string) {
              const requestContext = await getCurrentAuthContext();
              if (!isPasswordCompromiseCheckPath(requestContext.path)) {
                return await originalHash(password);
              }

              return await hashWithCompromiseCheck(password);
            },
          },
        },
      };
    },
  };
}
