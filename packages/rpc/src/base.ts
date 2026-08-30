import { os, type Schema } from '@orpc/server';
import type { EvlogOrpcContext } from 'evlog/orpc';

export const base = os
  .$context<{ headers: Headers } & EvlogOrpcContext>()
  .$input<Schema<void, unknown>>();
