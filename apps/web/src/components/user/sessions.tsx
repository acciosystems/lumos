import { authClient } from '@lumos/auth/auth-client';
import { IconAlertCircle } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Bowser from 'bowser';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

import { useStrictAuth } from '@/lib/auth/hooks';

import { Loading } from '../misc/loading';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '../ui/empty';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '../ui/item';

export function UserSessions() {
  const { session } = useStrictAuth();

  const { data, isPending, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['user-sessions', session.id],
    queryFn: async () => {
      const response = await authClient.listSessions();
      // oxlint-disable-next-line typescript/no-non-null-assertion
      return response
        .data!.map((s) => {
          const parser = Bowser.getParser(s.userAgent ?? '');
          const browser = parser.getBrowser();

          return Object.assign(s, {
            browser: `${browser.name} ${browser.version}`,
            isCurrent: s.id === session.id,
            relativeDate: formatDistance(s.createdAt, new Date(), {
              addSuffix: true,
              locale: ptBR,
            }),
          });
        })
        .toSorted(
          (a, b) =>
            Number(b.isCurrent) - Number(a.isCurrent) || Number(b.createdAt) - Number(a.createdAt),
        );
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (token: string) => await authClient.revokeSession({ token }),
    onSuccess: () => {
      toast.success('Sessão revogada com sucesso');
      refetch();
    },
    onError: (err) => toast.error('Falha ao revogar a sessão', { description: err.message }),
  });

  return (
    <Card size="sm" className="max-w-lg">
      <CardHeader>
        <CardTitle>Sessões Ativas</CardTitle>
      </CardHeader>

      <CardContent>
        {isPending && <Loading description="Carregando sessões" />}

        {isError && (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Falha ao carregar sessões</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {isSuccess &&
          (data.length > 0 ? (
            <ItemGroup>
              {data.map((s) => (
                <Item key={s.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>
                      {s.browser} {s.isCurrent && <Badge variant="secondary">Atual</Badge>}
                    </ItemTitle>
                    <ItemDescription className="flex flex-col">
                      <span>{s.ipAddress}</span>
                      <span>Iniciada {s.relativeDate}</span>
                    </ItemDescription>
                  </ItemContent>
                  {!s.isCurrent && (
                    <ItemActions>
                      <Button
                        variant="destructive"
                        size="xs"
                        onClick={() => revokeMutation.mutate(s.token)}
                        disabled={revokeMutation.isPending}
                      >
                        Revogar
                      </Button>
                    </ItemActions>
                  )}
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Nenhuma sessão ativa</EmptyTitle>
                <EmptyDescription>Algo está muito errado.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ))}
      </CardContent>
    </Card>
  );
}
