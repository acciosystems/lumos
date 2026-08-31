import { assertBodySize } from 'h3';
import { defineMiddleware } from 'nitro';

export const JSON_REQUEST_BODY_MAX_SIZE_BYTES = 1024 * 1024;

export default defineMiddleware(async (event) => {
  await assertBodySize(event, JSON_REQUEST_BODY_MAX_SIZE_BYTES);
});
