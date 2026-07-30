import { getDrain } from '@lumos/logging/options';
import { RPCHandler } from '@orpc/server/fetch';
import { withEvlog } from 'evlog/orpc';

import { router } from '.';

export const handler = withEvlog(new RPCHandler(router), { drain: getDrain() });
