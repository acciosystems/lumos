import { passkeyClient } from '@better-auth/passkey/client';
import {
  inferAdditionalFields,
  lastLoginMethodClient,
  usernameClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { tanstackStartCookies } from 'better-auth/tanstack-start';

import type { auth } from './auth';

export const authClient = createAuthClient({
  plugins: [
    tanstackStartCookies(),
    usernameClient(),
    passkeyClient(),
    lastLoginMethodClient(),
    inferAdditionalFields<typeof auth>(),
  ],
  fetchOptions: {
    // `throw: true` uses the status code as the message, which is not very helpful
    onError: (ctx) => {
      throw ctx.error;
    },
  },
});
