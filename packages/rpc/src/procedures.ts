import { evlog } from 'evlog/orpc';

import { base } from './base';
import { authMiddlware } from './middlewares/auth';

const mediator = base.use(evlog());

export const authorized = mediator.use(authMiddlware);
