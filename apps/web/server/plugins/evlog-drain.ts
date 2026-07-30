import { getDrain } from '@lumos/logging/options';
import { definePlugin } from 'nitro';

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook('evlog:drain', getDrain());
});
