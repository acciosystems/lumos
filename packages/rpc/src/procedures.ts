import { evlog } from 'evlog/orpc';

import { base } from './base';
import { authMiddleware } from './middlewares/auth';

export const publicProcedure = base.use(evlog());

export const authorized = publicProcedure.use(authMiddleware);
