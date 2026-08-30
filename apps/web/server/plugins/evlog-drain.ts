import { getDrain } from '@lumos/logging/options';
import { initLogger } from 'evlog';
import { definePlugin } from 'nitro';

export default definePlugin((nitroApp) => {
  const drain = getDrain();
  let standaloneDrainConfigured = false;

  // The evlog Nitro plugin initializes after user plugins, so configure its
  // standalone logger on the first request, before evlog's request hook runs.
  nitroApp.hooks.hook('request', () => {
    if (standaloneDrainConfigured) return;
    standaloneDrainConfigured = true;
    initLogger({ env: { service: 'lumos/web' }, drain });
  });
  nitroApp.hooks.hook('evlog:drain', drain);
  nitroApp.hooks.hook('close', () => drain.flush());
});
