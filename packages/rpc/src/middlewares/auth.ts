import { auth } from '@lumos/auth';
import { identifyOptions } from '@lumos/logging/options';
import { ORPCError } from '@orpc/client';
import { identifyUser } from 'evlog/better-auth';

import { base } from '../base';

export const authMiddleware = base.middleware(async ({ context, next }) => {
  const sessionData = await auth.api.getSession({
    headers: context.headers,
  });

  if (!sessionData?.session || !sessionData.user) throw new ORPCError('UNAUTHORIZED');

  identifyUser(context.log, sessionData, identifyOptions);

  return next({
    context: {
      session: sessionData.session,
      user: sessionData.user,
    },
  });
});
