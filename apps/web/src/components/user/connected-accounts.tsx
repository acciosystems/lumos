import { authClient } from '@lumos/auth/auth-client';
import { IconAlertCircle, IconBrandGoogle } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { useStrictAuth } from '@/lib/auth/hooks';
import { authQueryKeys, authQueryOptions } from '@/lib/queries/auth';

const providers = [{ id: 'google', name: 'Google', icon: IconBrandGoogle }];

export function UserConnectedAccounts() {
  const queryClient = useQueryClient();
  const { user } = useStrictAuth();
  const {
    data: accounts = [],
    isPending,
    isSuccess,
    isError,
    error,
  } = useQuery({
    ...authQueryOptions.accounts(user.id),
    select: (allAccounts) => allAccounts.filter((account) => account.providerId !== 'credential'),
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
    onSuccess: async () => {
      toast.success('Conta desvinculada com sucesso');
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.accounts(user.id) });
    },
    onError: (err) => toast.error('Falha ao desvincular conta', { description: err.message }),
  });

  return (
    <Card size="sm" className="max-w-lg">
      <CardHeader>
        <CardTitle>Contas Vinculadas</CardTitle>
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
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Nenhuma conta vinculada</EmptyTitle>
              </EmptyHeader>
            </Empty>
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
