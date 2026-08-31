import { os, type Schema } from '@orpc/server';
import type { EvlogOrpcContext } from 'evlog/orpc';

import type { RequestDeadline } from './deadline';

export const base = os
  .$context<{ headers: Headers; deadline: RequestDeadline } & EvlogOrpcContext>()
  .$input<Schema<void, unknown>>();
