import { authHandler } from '@lumos/auth/handler';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => await authHandler(request),
      POST: async ({ request }) => await authHandler(request),
    },
  },
});
