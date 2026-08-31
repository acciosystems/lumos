import { evlog } from 'evlog/orpc';

import { base } from './base';
import { authMiddleware } from './middlewares/auth';
import { dependencyTimeoutMiddleware } from './middlewares/dependency-timeout';

export const publicProcedure = base.use(evlog()).use(dependencyTimeoutMiddleware);

export const authorized = publicProcedure.use(authMiddleware);
