import { prisma } from '@lumos/database';
import { normalizeCnpj } from '@lumos/validation/organizer';
import { ORPCError } from '@orpc/client';

/**
 * Marks an organizer CNPJ as verified after a trusted verification workflow has completed.
 *
 * The CNPJ is part of the predicate so a verification result cannot be applied to a profile
 * whose identity changed while verification was in progress. This helper is intentionally not
 * exposed as an end-user RPC procedure.
 */
export async function markOrganizerCnpjVerified(profileId: string, cnpj: string) {
  const result = await prisma.organizerProfile.updateMany({
    where: {
      id: profileId,
      type: 'ORGANIZATION',
      cnpj: normalizeCnpj(cnpj),
    },
    data: { cnpjVerified: true },
  });

  if (result.count !== 1) {
    throw new ORPCError('CONFLICT', {
      message: 'O CNPJ do perfil mudou antes da conclusão da verificação.',
    });
  }
}
