import { useContext } from 'react';

import { AuthContext } from './provider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function useStrictAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useStrictAuth must be used within an AuthProvider');

  if (!context.isAuthenticated)
    throw new Error('useStrictAuth requires the user to be authenticated');

  return {
    refreshSession: context.refreshSession,
    session: context.session,
    user: context.user,
  };
}
