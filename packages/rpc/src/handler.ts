import { deliverToAxiom, registerDeliveryLifetime } from '@lumos/logging/delivery';
import { RPCHandler } from '@orpc/server/fetch';
import { withEvlog } from 'evlog/orpc';

import { router } from '.';

export const handler = withEvlog(new RPCHandler(router), {
  drain: deliverToAxiom,
  waitUntil: registerDeliveryLifetime,
  routes: {
    '/api/rpc/**': { service: 'lumos/rpc' },
  },
});
