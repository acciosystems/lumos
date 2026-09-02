import { createRequestDeadlineForRequest } from '@lumos/request-deadline';
import { defineMiddleware } from 'nitro';

// This runs before auth-context so every server-side operation shares the invocation clock.
export default defineMiddleware((event) => {
  createRequestDeadlineForRequest(event.req);
});
