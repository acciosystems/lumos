import { deliverToAxiom } from '@lumos/logging/delivery';
import { definePlugin } from 'nitro';

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook('evlog:drain', deliverToAxiom);
});
