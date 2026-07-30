import { os, type Schema } from '@orpc/server';
import { initLogger } from 'evlog';
import type { EvlogOrpcContext } from 'evlog/orpc';

initLogger({
  env: { service: 'lumos/rpc' },
});

export const base = os
  .$context<{ headers: Headers } & EvlogOrpcContext>()
  .$input<Schema<void, unknown>>();
