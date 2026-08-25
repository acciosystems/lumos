import { IconAlertCircle } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import { Loading } from '@/components/misc/loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { useStrictAuth } from '@/lib/auth/hooks';
import { authQueryOptions } from '@/lib/queries/auth';

import { UserPasswordChange } from './password-change';
import { UserPasswordSet } from './password-set';

export function UserSecuritySettings() {
  const { user } = useStrictAuth();
  const {
    data: hasPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useQuery({
    ...authQueryOptions.accounts(user.id),
    select: (accounts) => accounts.some((account) => account.providerId === 'credential'),
  });

  return (
    <Card size="sm" className="max-w-lg">
      <CardContent>
        {isPending && <Loading description="Carregando dados" />}

        {isError && (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Falha ao carregar dados</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <Field orientation="horizontal">
            <FieldLabel>Senha</FieldLabel>
            {hasPassword ? <UserPasswordChange /> : <UserPasswordSet />}
          </Field>
        )}
      </CardContent>
    </Card>
  );
}
