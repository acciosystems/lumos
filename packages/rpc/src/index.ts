import { campaignRouter } from './routers/campaign';
import { organizerRouter } from './routers/organizer';
import { userRouter } from './routers/user';

export const router = {
  campaign: campaignRouter,
  organizer: organizerRouter,
  user: userRouter,
};
