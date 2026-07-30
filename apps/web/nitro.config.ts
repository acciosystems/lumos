import evlog from 'evlog/nitro/v3';
import { defineConfig } from 'nitro';

export default defineConfig({
  serverDir: 'server',
  experimental: {
    asyncContext: true,
  },
  modules: [
    evlog({
      env: { service: 'lumos/web' },
      exclude: ['/api/rpc/**', '/_serverFn/**'],
      routes: {
        '/api/auth/**': { service: 'lumos/auth' },
      },
    }),
  ],
});
