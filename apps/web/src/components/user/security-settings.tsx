import { authClient } from '@lumos/auth/auth-client';
import { IconAlertCircle } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import { Loading } from '@/components/misc/loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';

import { UserPasswordChange } from './password-change';
import { UserPasswordSet } from './password-set';

export function UserSecuritySettings() {
  const {
    data: hasPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ['has-password'],
    queryFn: async () => {
      const response = await authClient.listAccounts();
      // oxlint-disable-next-line typescript/no-non-null-assertion
      return response.data!.some((acc) => acc.providerId === 'credential');
    },
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
            <FieldLabel>Password</FieldLabel>
            {hasPassword ? <UserPasswordChange /> : <UserPasswordSet />}
          </Field>
        )}
      </CardContent>
    </Card>
  );
}
