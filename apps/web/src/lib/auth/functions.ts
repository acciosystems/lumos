import { auth } from '@lumos/auth';
import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getIsAuthenticatedFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  return Boolean(session);
});

export const ensureAuthFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) throw redirect({ to: '/sign-in' });

  return session;
});

export const ensureNotAuthFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (session) throw redirect({ to: '/' });
});
