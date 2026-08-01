import { authClient } from '@lumos/auth/auth-client';
import { IconAlertCircle, IconBrandGoogle } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { Loading } from '@/components/misc/loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';

const providers = [{ id: 'google', name: 'Google', icon: IconBrandGoogle }];

export function UserConnectedAccounts() {
  const {
    data: accounts = [],
    isPending,
    isSuccess,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['connected-accounts'],
    queryFn: async () => {
      const response = await authClient.listAccounts();
      // oxlint-disable-next-line typescript/no-non-null-assertion
      return response.data!.filter((acc) => acc.providerId !== 'credential');
    },
  });

  const { formattedProviders, availableProviders } = useMemo(() => {
    const connectedIds = new Set(accounts.map((acc) => acc.providerId));

    return {
      formattedProviders: providers.filter((prov) => connectedIds.has(prov.id)),
      availableProviders: providers.filter((prov) => !connectedIds.has(prov.id)),
    };
  }, [accounts]);

  const linkMutation = useMutation({
    mutationFn: async (provider: string) =>
      await authClient.linkSocial({ provider, callbackURL: '/settings' }),
    onSuccess: () => toast.success('Você será redirecionado para vincular sua conta'),
    onError: (err) => toast.error('Falha ao vincular conta', { description: err.message }),
  });

  const unlinkMutation = useMutation({
    mutationFn: async (provider: string) =>
      await authClient.unlinkAccount({ providerId: provider }),
    onSuccess: () => {
      toast.success('Conta desvinculada com sucesso');
      refetch();
    },
    onError: (err) => toast.error('Falha ao desvincular conta', { description: err.message }),
  });

  return (
    <Card size="sm" className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base!">Contas Vinculadas</CardTitle>
      </CardHeader>

      <CardContent>
        {isPending && <Loading description="Carregando contas" />}

        {isError && (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Falha ao carregar contas</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {isSuccess &&
          (formattedProviders.length > 0 ? (
            <ItemGroup>
              {formattedProviders.map((provider) => (
                <Item key={provider.id} variant="outline">
                  <ItemMedia variant="icon">
                    <provider.icon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{provider.name}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => unlinkMutation.mutate(provider.id)}
                      disabled={unlinkMutation.isPending}
                    >
                      Desvincular
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <Alert>
              <AlertTitle>Nenhuma conta vinculada</AlertTitle>
            </Alert>
          ))}
      </CardContent>

      <CardFooter className="justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button disabled={availableProviders.length === 0} />}>
            Vincular conta
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {availableProviders.map((provider) => (
              <DropdownMenuItem key={provider.id} onClick={() => linkMutation.mutate(provider.id)}>
                <provider.icon /> {provider.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
