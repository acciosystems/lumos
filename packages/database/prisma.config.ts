import { defineConfig } from 'prisma/config';

const datasource = process.env.DIRECT_DATABASE_URL
  ? {
      url: (await import('@lumos/env/database-admin')).env.DIRECT_DATABASE_URL,
    }
  : undefined;

export default defineConfig({
  schema: 'prisma/schemas',
  migrations: {
    path: 'prisma/migrations',
  },
  // Client generation only reads the schema. Keeping the direct connection optional here lets
  // deployment builds generate the client without exposing an administrative DB credential.
  ...(datasource ? { datasource } : {}),
});
