import { env } from '@lumos/env/database';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schemas',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
