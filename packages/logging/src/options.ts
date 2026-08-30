import type { IdentifyOptions } from 'evlog/better-auth';

export const identifyOptions: IdentifyOptions = {
  maskEmail: true,
  fields: ['id', 'name', 'username', 'email', 'image', 'createdAt'],
  // remove duplicated userId field
  extend: (_) => ({ userId: undefined }),
};
