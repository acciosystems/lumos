import { prisma } from '@lumos/database';
import { Prisma } from '@lumos/database/generated/prisma/client';
import { normalizeCnpj, organizerProfileUpsertInputSchema } from '@lumos/validation/organizer';
import { ORPCError } from '@orpc/client';

import { runDatabaseTransaction } from '../deadline';
import { authorized } from '../procedures';

const organizerProfileSelect = {
  id: true,
  type: true,
  displayName: true,
  bio: true,
  websiteUrl: true,
  cnpj: true,
  cnpjVerified: true,
} as const;

export const organizerRouter = {
  me: authorized.handler(async ({ context: { user } }) =>
    prisma.organizerProfile.findUnique({
      where: { userId: user.id },
      select: organizerProfileSelect,
    }),
  ),

  upsert: authorized
    .input(organizerProfileUpsertInputSchema)
    .handler(async ({ input, context: { user } }) => {
      const cnpj = input.type === 'ORGANIZATION' ? normalizeCnpj(input.cnpj ?? '') : null;

      try {
        return await runDatabaseTransaction(async (transaction) => {
          // Serialize profile creation and updates for this user, including the no-profile case.
          await transaction.$queryRaw(
            Prisma.sql`SELECT "id" FROM "users" WHERE "id" = ${user.id} FOR UPDATE`,
          );

          const current = await transaction.$queryRaw<
            Array<{
              id: string;
              type: 'INDIVIDUAL' | 'ORGANIZATION';
              cnpj: string | null;
              cnpjVerified: boolean;
            }>
          >(
            Prisma.sql`
              SELECT "id", "type", "cnpj", "cnpjVerified"
              FROM "organizer_profiles"
              WHERE "userId" = ${user.id}
              FOR UPDATE
            `,
          );

          const existing = current[0];
          if (!existing) {
            return transaction.organizerProfile.create({
              data: {
                userId: user.id,
                type: input.type,
                displayName: input.displayName,
                bio: input.bio || null,
                websiteUrl: input.websiteUrl || null,
                cnpj,
                cnpjVerified: false,
              },
              select: organizerProfileSelect,
            });
          }

          const normalizedCurrentCnpj = normalizeCnpj(existing.cnpj ?? '');
          const cnpjChanged = normalizedCurrentCnpj !== (cnpj ?? '');
          const cnpjVerified =
            existing.type === 'ORGANIZATION' && input.type === 'ORGANIZATION' && !cnpjChanged
              ? existing.cnpjVerified
              : false;

          return transaction.organizerProfile.update({
            where: { id: existing.id },
            data: {
              type: input.type,
              displayName: input.displayName,
              bio: input.bio || null,
              websiteUrl: input.websiteUrl || null,
              cnpj,
              cnpjVerified,
            },
            select: organizerProfileSelect,
          });
        });
      } catch (error) {
        // The user-row lock rules out a concurrent conflict on `userId`; P2002 here is `cnpj`.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          throw new ORPCError('CONFLICT', {
            message: 'Este CNPJ já está em uso.',
            cause: error,
          });
        }

        throw error;
      }
    }),
};
