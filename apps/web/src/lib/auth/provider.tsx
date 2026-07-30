import type { Session, User } from '@lumos/auth';
import { authClient } from '@lumos/auth/auth-client';
import { createContext, useMemo } from 'react';

type AuthContextType =
  | {
      isPending: true;
      isAuthenticated: false;
      user: null;
      session: null;
    }
  | {
      isPending: false;
      isAuthenticated: true;
      user: User;
      session: Session;
    }
  | {
      isPending: false;
      isAuthenticated: false;
      user: null;
      session: null;
    };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();

  const value = useMemo(
    () => ({
      isPending,
      isAuthenticated: Boolean(data?.session),
      user: data?.user ?? null,
      session: data?.session ?? null,
    }),
    [data, isPending],
  );

  return <AuthContext.Provider value={value as AuthContextType}>{children}</AuthContext.Provider>;
}
