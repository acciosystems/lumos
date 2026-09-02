import evlog from 'evlog/nitro/v3';
import { defineConfig } from 'nitro';

export default defineConfig({
  preset: 'vercel',
  compatibilityDate: '2026-08-24',
  // Avoid Rolldown splitting TanStack Start's cyclic SSR service graph into invalid chunks.
  // Remove this once the upstream chunking bug no longer reproduces in the production artifact.
  inlineDynamicImports: true,
  vercel: {
    functions: {
      maxDuration: 60,
    },
  },
  serverDir: 'server',
  experimental: {
    asyncContext: true,
  },
  modules: [
    evlog({
      env: { service: 'lumos/web' },
      redact: true,
      silent: true,
      exclude: ['/api/rpc/**', '/_serverFn/**'],
      routes: {
        '/api/auth/**': { service: 'lumos/auth' },
      },
    }),
  ],
});
