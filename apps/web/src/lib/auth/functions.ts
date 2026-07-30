import { auth } from '@lumos/auth';
import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders, getRequestUrl } from '@tanstack/react-start/server';

export const ensureAuthFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const { pathname } = getRequestUrl();
  const session = await auth.api.getSession({ headers });

  if (!session) throw redirect({ to: '/sign-in' });

  if (!session.user.onboarded && pathname !== '/onboarding') throw redirect({ to: '/onboarding' });
  if (session.user.onboarded && pathname === '/onboarding') throw redirect({ to: '/' });

  return session;
});

export const ensureNotAuthFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (session) throw redirect({ to: '/' });
});
