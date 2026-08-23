import type { Session, User } from '@lumos/auth';

import { useAuth } from './hooks';

interface AuthenticatedRenderProps {
  session: Session;
  user: User;
}

type WhenCondition = 'authenticated' | 'unauthenticated' | 'loading';

interface AuthGuardProps {
  when: WhenCondition;
  children: React.ReactNode | ((props: AuthenticatedRenderProps) => React.ReactNode);
}

export function AuthGuard({ when, children }: AuthGuardProps) {
  const { isPending, isAuthenticated, session, user } = useAuth();

  let shouldRender = false;

  // oxlint-disable-next-line default-case
  switch (when) {
    case 'loading': {
      shouldRender = isPending;
      break;
    }
    case 'authenticated': {
      shouldRender = isAuthenticated && !isPending;
      break;
    }
    case 'unauthenticated': {
      shouldRender = !isAuthenticated && !isPending;
      break;
    }
  }

  if (!shouldRender) return null;

  if (when === 'authenticated' && typeof children === 'function' && session && user)
    return children({ session, user });

  return <>{children}</>;
}
