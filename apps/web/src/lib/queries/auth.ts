import { authClient } from '@lumos/auth/auth-client';
import { queryOptions } from '@tanstack/react-query';

export const authQueryKeys = {
  all: ['auth'] as const,
  user: (userId: string) => [...authQueryKeys.all, userId] as const,
  accounts: (userId: string) => [...authQueryKeys.user(userId), 'accounts'] as const,
  passkeys: (userId: string) => [...authQueryKeys.user(userId), 'passkeys'] as const,
  sessions: (userId: string) => [...authQueryKeys.user(userId), 'sessions'] as const,
};

export const authQueryOptions = {
  accounts: (userId: string) =>
    queryOptions({
      queryKey: authQueryKeys.accounts(userId),
      queryFn: async () => {
        const response = await authClient.listAccounts();
        // oxlint-disable-next-line typescript/no-non-null-assertion
        return response.data!;
      },
    }),
  passkeys: (userId: string) =>
    queryOptions({
      queryKey: authQueryKeys.passkeys(userId),
      queryFn: async () => {
        const response = await authClient.passkey.listUserPasskeys();
        // oxlint-disable-next-line typescript/no-non-null-assertion
        return response.data!;
      },
    }),
  sessions: (userId: string) =>
    queryOptions({
      queryKey: authQueryKeys.sessions(userId),
      queryFn: async () => {
        const response = await authClient.listSessions();
        // oxlint-disable-next-line typescript/no-non-null-assertion
        return response.data!;
      },
    }),
};
