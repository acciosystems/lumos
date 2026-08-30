import { getDrain } from '@lumos/logging/options';
import { os, type Schema } from '@orpc/server';
import { initLogger } from 'evlog';
import type { EvlogOrpcContext } from 'evlog/orpc';

initLogger({
  env: { service: 'lumos/rpc' },
  drain: getDrain(),
});

export const base = os
  .$context<{ headers: Headers } & EvlogOrpcContext>()
  .$input<Schema<void, unknown>>();
