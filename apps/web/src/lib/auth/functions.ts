import { auth } from '@lumos/auth';
import { assertForegroundDeadline, requireActiveRequestDeadline } from '@lumos/request-deadline';
import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getIsAuthenticatedFn = createServerFn().handler(async () => {
  const session = await getSession();

  return Boolean(session);
});

export const ensureAuthFn = createServerFn().handler(async () => {
  const session = await getSession();

  if (!session) throw redirect({ to: '/sign-in' });

  return session;
});

export const ensureNotAuthFn = createServerFn().handler(async () => {
  const session = await getSession();

  if (session) throw redirect({ to: '/' });
});

async function getSession() {
  const deadline = requireActiveRequestDeadline();
  assertForegroundDeadline(deadline, 'auth_session_before_request');
  const session = await auth.api.getSession({ headers: getRequestHeaders() });
  assertForegroundDeadline(deadline, 'auth_session_after_request');
  return session;
}
