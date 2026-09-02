import { requireActiveRequestDeadline } from '@lumos/request-deadline';
import { handler } from '@lumos/rpc/handler';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/rpc/$')({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { response } = await handler.handle(request, {
          prefix: '/api/rpc',
          // @ts-expect-error needed because of evlog context
          context: { headers: request.headers, deadline: requireActiveRequestDeadline() },
        });

        return response ?? new Response('Not Found', { status: 404 });
      },
    },
  },
});
