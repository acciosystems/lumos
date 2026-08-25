import { prisma } from '@lumos/database';
import { normalizeCnpj, organizerProfileUpsertInputSchema } from '@lumos/validation/organizer';

import { withUniqueConstraintConflicts } from '../errors/prisma';
import { authorized } from '../procedures';

const organizerProfileSelect = {
  id: true,
  type: true,
  displayName: true,
  bio: true,
  websiteUrl: true,
  cnpj: true,
} as const;

const organizerProfileUniqueConflicts = [
  {
    target: ['cnpj'],
    message: 'Este CNPJ já está em uso.',
  },
] as const;

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

      return withUniqueConstraintConflicts(
        () =>
          prisma.organizerProfile.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              type: input.type,
              displayName: input.displayName,
              bio: input.bio || null,
              websiteUrl: input.websiteUrl || null,
              cnpj,
            },
            update: {
              type: input.type,
              displayName: input.displayName,
              bio: input.bio || null,
              websiteUrl: input.websiteUrl || null,
              cnpj,
            },
            select: organizerProfileSelect,
          }),
        organizerProfileUniqueConflicts,
      );
    }),
};
