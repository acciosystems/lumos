import { router } from '@lumos/rpc';
import {
  createORPCClient,
  createRouterClient,
  createTanstackQueryUtils,
  RPCLink,
  type RouterClient,
} from '@lumos/rpc/client';
import { createRequestDeadline } from '@lumos/rpc/deadline';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const useRPC = createIsomorphicFn()
  .client(() => {
    const link = new RPCLink({
      url: `${globalThis.window.origin}/api/rpc`,
    });

    const client: RouterClient<typeof router> = createORPCClient(link);

    return client;
  })
  .server(() =>
    createRouterClient(router, {
      // @ts-expect-error needed because of evlog context
      context: () => ({
        headers: getRequestHeaders(),
        deadline: createRequestDeadline(),
      }),
    }),
  );

export const rpc = createTanstackQueryUtils(useRPC());
