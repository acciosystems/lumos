import { env } from '@lumos/env/database-admin';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schemas',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env.DIRECT_DATABASE_URL,
  },
});
