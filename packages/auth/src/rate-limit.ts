const DEFAULT_RATE_LIMIT = { window: 60, max: 100 } as const;
const STORAGE_CLEANUP_WINDOW_SECONDS = 15 * 60;

export const AUTH_RATE_LIMIT_OPTIONS = {
  storage: 'database',
  // Better Auth uses the top-level window as the database cleanup horizon. Keep it at least as
  // long as every custom rule so cleanup cannot remove a counter that is still active.
  window: STORAGE_CLEANUP_WINDOW_SECONDS,
  max: DEFAULT_RATE_LIMIT.max,
  customRules: {
    '/sign-in/*': { window: 60, max: 10 },
    '/sign-up/*': { window: 10 * 60, max: 5 },
    '/request-password-reset': { window: 15 * 60, max: 3 },
    '/reset-password': { window: 15 * 60, max: 5 },
    '/send-verification-email': { window: 15 * 60, max: 3 },
    '/verify-email': { window: 15 * 60, max: 5 },
    '/passkey/generate-authenticate-options': { window: 60, max: 10 },
    '/passkey/verify-authentication': { window: 60, max: 10 },
    '/passkey/generate-register-options': { window: 10 * 60, max: 5 },
    '/passkey/verify-registration': { window: 10 * 60, max: 5 },
    '/**': (_request: Request, currentRule: { window: number; max: number }) =>
      currentRule.window === STORAGE_CLEANUP_WINDOW_SECONDS &&
      currentRule.max === DEFAULT_RATE_LIMIT.max
        ? DEFAULT_RATE_LIMIT
        : currentRule,
  },
} as const;

export type AuthRateLimitEndpoint =
  | 'sign_in'
  | 'sign_up'
  | 'password_reset'
  | 'email_verification'
  | 'passkey_authentication'
  | 'passkey_registration'
  | 'other';

export function classifyAuthRateLimitEndpoint(pathname: string): AuthRateLimitEndpoint {
  const path = pathname.startsWith('/api/auth')
    ? pathname.slice('/api/auth'.length) || '/'
    : pathname;

  if (path.startsWith('/sign-in/')) return 'sign_in';
  if (path.startsWith('/sign-up/')) return 'sign_up';
  if (path === '/request-password-reset' || path === '/reset-password') return 'password_reset';
  if (path === '/send-verification-email' || path === '/verify-email') {
    return 'email_verification';
  }
  if (
    path === '/passkey/generate-authenticate-options' ||
    path === '/passkey/verify-authentication'
  ) {
    return 'passkey_authentication';
  }
  if (path === '/passkey/generate-register-options' || path === '/passkey/verify-registration') {
    return 'passkey_registration';
  }
  return 'other';
}
