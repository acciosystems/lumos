import { authClient } from '@lumos/auth/auth-client';
import { IconAlertCircle, IconKey } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Loading } from '@/components/misc/loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';

import { UserPasskeyRegister } from './passkey-register';

export function UserPasskeys() {
  const queryClient = useQueryClient();
  const {
    data: passkeys,
    isPending,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ['passkeys'],
    queryFn: async () => {
      const result = await authClient.passkey.listUserPasskeys();
      // oxlint-disable-next-line typescript/no-non-null-assertion
      return result.data!;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => await authClient.passkey.deletePasskey({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passkeys'] });
      toast.success('Chave de acesso removida com sucesso');
    },
    onError: (err) => toast.error('Falha ao remover chave de acesso', { description: err.message }),
  });

  return (
    <Card size="sm" className="max-w-lg">
      <CardHeader>
        <CardTitle>Chaves de Acesso</CardTitle>
      </CardHeader>

      <CardContent>
        {isPending && <Loading description="Carregando chaves de acesso" />}

        {isError && (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Falha ao carregar chaves de acesso</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {isSuccess &&
          (passkeys.length > 0 ? (
            <ItemGroup>
              {passkeys.map((passkey) => (
                <Item key={passkey.id} variant="outline">
                  <ItemMedia variant="icon">
                    <IconKey className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{passkey.name}</ItemTitle>
                    <ItemDescription>{passkey.credentialID}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => removeMutation.mutate(passkey.id)}
                      disabled={removeMutation.isPending}
                    >
                      Remover
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Nenhuma chave de acesso encontrada</EmptyTitle>
              </EmptyHeader>
            </Empty>
          ))}
      </CardContent>

      <CardFooter className="justify-end">
        <UserPasskeyRegister queryClient={queryClient} isPending={isPending} />
      </CardFooter>
    </Card>
  );
}
