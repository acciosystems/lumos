import type { Session, User } from '@lumos/auth';
import { authClient } from '@lumos/auth/auth-client';
import { createContext, useMemo } from 'react';

type AuthContextType =
  | {
      isPending: true;
      isAuthenticated: false;
      user: null;
      session: null;
      refreshSession: () => Promise<void>;
    }
  | {
      isPending: false;
      isAuthenticated: true;
      user: User;
      session: Session;
      refreshSession: () => Promise<void>;
    }
  | {
      isPending: false;
      isAuthenticated: false;
      user: null;
      session: null;
      refreshSession: () => Promise<void>;
    };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, refetch } = authClient.useSession();

  const value = useMemo(
    () => ({
      isPending,
      isAuthenticated: Boolean(data?.session),
      user: data?.user ?? null,
      session: data?.session ?? null,
      refreshSession: refetch,
    }),
    [data, isPending, refetch],
  );

  return <AuthContext.Provider value={value as AuthContextType}>{children}</AuthContext.Provider>;
}
