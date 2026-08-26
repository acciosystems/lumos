import { prisma } from '@lumos/database';
import { Prisma } from '@lumos/database/generated/prisma/client';
import type { CampaignInclude, CampaignSelect } from '@lumos/database/generated/prisma/models';
import {
  CampaignType,
  campaignByIdInputSchema,
  campaignCreateInputSchema,
  campaignLifecycleTransitionInputSchema,
  campaignListInputSchema,
  campaignDetailsUpdateInputSchema,
  campaignPublishUpdateInputSchema,
  campaignProgressUpdateInputSchema,
  type CampaignCreateInput,
} from '@lumos/validation/campaign';
import { ORPCError } from '@orpc/client';
import * as v from 'valibot';

import { authorized, publicProcedure } from '../procedures';
import { toCampaignCreateData } from '../services/campaign-create';
import {
  toCampaignCollectionPointData,
  toCampaignCollectionPointFields,
  toCampaignUpdateData,
} from '../services/campaign-update';

const activeParticipantWhere = { cancelledAt: null } as const;

const campaignInclude = {
  organizerProfile: {
    select: {
      id: true,
      type: true,
      displayName: true,
      cnpj: true,
      cnpjVerified: true,
    },
  },
  collectionPoints: {
    orderBy: { createdAt: 'asc' as const },
  },
  updates: {
    select: {
      id: true,
      message: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: 'desc' as const },
    take: 5,
  },
  accountability: true,
  _count: {
    select: {
      participants: {
        where: activeParticipantWhere,
      },
    },
  },
} as const satisfies CampaignInclude;

const publicCampaignListSelect = {
  id: true,
  title: true,
  description: true,
  type: true,
  category: true,
  region: true,
  startDate: true,
  endDate: true,
  imageUrl: true,
  organizerProfile: {
    select: {
      displayName: true,
    },
  },
  _count: {
    select: {
      participants: {
        where: activeParticipantWhere,
      },
    },
  },
} as const satisfies CampaignSelect;

const publicCampaignDetailSelect = {
  ...publicCampaignListSelect,
  location: true,
  targetItems: true,
  currentItems: true,
  pixKey: true,
  bankAccountInfo: true,
  organizerProfile: {
    select: {
      type: true,
      displayName: true,
      cnpj: true,
      cnpjVerified: true,
    },
  },
  collectionPoints: {
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      lat: true,
      lon: true,
      instructions: true,
    },
    orderBy: { createdAt: 'asc' as const },
  },
  updates: {
    select: {
      id: true,
      message: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: 'desc' as const },
    take: 5,
  },
} as const satisfies CampaignSelect;

function withParticipantCount<Campaign extends { _count: { participants: number } }>(
  campaign: Campaign,
) {
  const { _count, ...campaignData } = campaign;
  return { ...campaignData, participantCount: _count.participants };
}

function assertCampaignAcceptsParticipation(campaign: {
  type: 'PHYSICAL' | 'VIRTUAL';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}) {
  if (campaign.type !== 'PHYSICAL') {
    throw new ORPCError('BAD_REQUEST', {
      message: 'Somente campanhas físicas aceitam participantes.',
    });
  }

  if (campaign.status !== 'ACTIVE') {
    throw new ORPCError('BAD_REQUEST', {
      message: 'A campanha precisa estar ativa para alterar a participação.',
    });
  }
}

function assertCampaignIsActive(campaign: {
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}) {
  if (campaign.status !== 'ACTIVE') {
    throw new ORPCError('BAD_REQUEST', {
      message: 'A campanha precisa estar ativa para realizar esta ação.',
    });
  }
}

const campaignDateSchema = v.pipe(
  v.string(),
  v.isoDate(),
  v.transform((value) => new Date(value)),
);

function parseDate(value: string, label: string) {
  const result = v.safeParse(campaignDateSchema, value);
  if (!result.success) {
    throw new ORPCError('BAD_REQUEST', { message: `${label} deve ser uma data válida.` });
  }
  return result.output;
}

function assertCreateInput(input: CampaignCreateInput) {
  const startDate = parseDate(input.startDate, 'A data inicial');
  const endDate = parseDate(input.endDate, 'A data final');

  if (endDate <= startDate) {
    throw new ORPCError('BAD_REQUEST', {
      message: 'A data final deve ser posterior à data inicial.',
    });
  }

  if (input.type === CampaignType.PHYSICAL) {
    if (!input.location || !input.targetItems || !input.collectionPoints?.length) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Campanhas físicas precisam de local, meta de itens e ponto de coleta.',
      });
    }
  }

  if (input.type === CampaignType.VIRTUAL && !input.pixKey && !input.bankAccountInfo) {
    throw new ORPCError('BAD_REQUEST', {
      message: 'Campanhas virtuais precisam de uma chave PIX ou dados bancários.',
    });
  }

  return { startDate, endDate };
}

export const campaignRouter = {
  list: publicProcedure.input(campaignListInputSchema).handler(async ({ input }) => {
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'ACTIVE',
        ...(input.category ? { category: { contains: input.category, mode: 'insensitive' } } : {}),
        ...(input.region ? { region: { contains: input.region, mode: 'insensitive' } } : {}),
        ...(input.type ? { type: input.type } : {}),
      },
      select: publicCampaignListSelect,
      orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }, { id: 'desc' }],
      ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      take: input.limit + 1,
    });

    const hasNextPage = campaigns.length > input.limit;
    const items = campaigns.slice(0, input.limit).map(withParticipantCount);

    return {
      items,
      nextCursor: hasNextPage ? (items.at(-1)?.id ?? null) : null,
    };
  }),

  publicById: publicProcedure.input(campaignByIdInputSchema).handler(async ({ input }) => {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: input.id,
        status: 'ACTIVE',
      },
      select: publicCampaignDetailSelect,
    });

    if (!campaign) {
      throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada ou não está ativa.' });
    }

    return withParticipantCount(campaign);
  }),

  byId: authorized.input(campaignByIdInputSchema).handler(async ({ input, context: { user } }) => {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: input.id,
        organizerProfile: { userId: user.id },
      },
      include: campaignInclude,
    });

    if (!campaign) {
      throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
    }

    const { _count, ...campaignData } = campaign;

    return {
      ...campaignData,
      participantCount: _count.participants,
    };
  }),

  myCampaigns: authorized.handler(async ({ context: { user } }) => {
    const organizerProfile = await prisma.organizerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!organizerProfile) return [];

    const campaigns = await prisma.campaign.findMany({
      where: {
        organizerProfileId: organizerProfile.id,
      },
      include: {
        organizerProfile: {
          select: {
            displayName: true,
          },
        },
        _count: {
          select: {
            participants: {
              where: activeParticipantWhere,
            },
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return campaigns.map(withParticipantCount);
  }),

  myParticipations: authorized.handler(async ({ context: { user } }) => {
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'ACTIVE',
        type: 'PHYSICAL',
        participants: {
          some: {
            userId: user.id,
            ...activeParticipantWhere,
          },
        },
      },
      select: publicCampaignListSelect,
      orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
    });

    return campaigns.map(withParticipantCount);
  }),

  participationState: authorized
    .input(campaignByIdInputSchema)
    .handler(async ({ input, context: { user } }) => {
      const participant = await prisma.campaignParticipant.findUnique({
        where: { campaignId_userId: { campaignId: input.id, userId: user.id } },
        select: { cancelledAt: true },
      });

      return { isParticipating: participant?.cancelledAt === null };
    }),

  canCreate: authorized.handler(async ({ context: { user } }) => {
    const organizerProfile = await prisma.organizerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    return { hasOrganizerProfile: Boolean(organizerProfile) };
  }),

  join: authorized.input(campaignByIdInputSchema).handler(async ({ input, context: { user } }) =>
    prisma.$transaction(async (transaction) => {
      await transaction.$queryRaw(
        Prisma.sql`SELECT "id" FROM "campaigns" WHERE "id" = ${input.id} FOR UPDATE`,
      );

      const campaign = await transaction.campaign.findUnique({
        where: { id: input.id },
        select: { status: true, type: true },
      });

      if (!campaign) {
        throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
      }

      assertCampaignAcceptsParticipation(campaign);

      const confirmedAt = new Date();
      const reactivated = await transaction.campaignParticipant.updateMany({
        where: {
          campaignId: input.id,
          userId: user.id,
          cancelledAt: { not: null },
        },
        data: { confirmedAt, cancelledAt: null },
      });

      if (!reactivated.count) {
        await transaction.campaignParticipant.upsert({
          where: { campaignId_userId: { campaignId: input.id, userId: user.id } },
          create: {
            campaignId: input.id,
            userId: user.id,
            confirmedAt,
          },
          update: { cancelledAt: null },
        });
      }

      const participantCount = await transaction.campaignParticipant.count({
        where: { campaignId: input.id, ...activeParticipantWhere },
      });

      return { isParticipating: true, participantCount };
    }),
  ),

  cancelParticipation: authorized
    .input(campaignByIdInputSchema)
    .handler(async ({ input, context: { user } }) =>
      prisma.$transaction(async (transaction) => {
        const campaign = await transaction.campaign.findUnique({
          where: { id: input.id },
          select: { status: true, type: true },
        });

        if (!campaign) {
          throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
        }

        assertCampaignAcceptsParticipation(campaign);

        await transaction.campaignParticipant.updateMany({
          where: {
            campaignId: input.id,
            userId: user.id,
            ...activeParticipantWhere,
          },
          data: { cancelledAt: new Date() },
        });

        const participantCount = await transaction.campaignParticipant.count({
          where: { campaignId: input.id, ...activeParticipantWhere },
        });

        return { isParticipating: false, participantCount };
      }),
    ),

  updateProgress: authorized
    .input(campaignProgressUpdateInputSchema)
    .handler(async ({ input, context: { user } }) =>
      prisma.$transaction(async (transaction) => {
        const campaign = await transaction.campaign.findFirst({
          where: {
            id: input.id,
            organizerProfile: { userId: user.id },
          },
          select: { status: true, type: true },
        });

        if (!campaign) {
          throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
        }

        if (campaign.type !== 'PHYSICAL') {
          throw new ORPCError('BAD_REQUEST', {
            message: 'Somente campanhas físicas possuem progresso de itens.',
          });
        }

        assertCampaignIsActive(campaign);

        const result = await transaction.campaign.updateMany({
          where: { id: input.id, status: 'ACTIVE', type: 'PHYSICAL' },
          data: { currentItems: input.currentItems },
        });

        if (!result.count) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'A campanha não está mais ativa para atualizar o progresso.',
          });
        }

        return { currentItems: input.currentItems };
      }),
    ),

  updateDetails: authorized
    .input(campaignDetailsUpdateInputSchema)
    .handler(async ({ input, context: { user } }) =>
      prisma.$transaction(async (transaction) => {
        await transaction.$queryRaw(
          Prisma.sql`SELECT "id" FROM "campaigns" WHERE "id" = ${input.id} FOR UPDATE`,
        );

        const campaign = await transaction.campaign.findFirst({
          where: {
            id: input.id,
            organizerProfile: { userId: user.id },
          },
          select: { status: true, type: true },
        });

        if (!campaign) {
          throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
        }

        assertCampaignIsActive(campaign);

        if (campaign.type !== input.type) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'O tipo da campanha não pode ser alterado.',
          });
        }

        const startDate = parseDate(input.startDate, 'A data inicial');
        const endDate = parseDate(input.endDate, 'A data final');

        if (endDate <= startDate) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'A data final deve ser posterior à data inicial.',
          });
        }

        const result = await transaction.campaign.updateMany({
          where: { id: input.id, status: 'ACTIVE', type: input.type },
          data: toCampaignUpdateData(input, { startDate, endDate }),
        });

        if (!result.count) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'A campanha não está mais ativa para editar seus detalhes.',
          });
        }

        if (input.type === CampaignType.PHYSICAL) {
          const existingPoints = await transaction.campaignCollectionPoint.findMany({
            where: { campaignId: input.id },
            select: { id: true },
          });
          const existingPointIds = new Set(existingPoints.map((point) => point.id));
          const retainedPointIds = input.collectionPoints.flatMap((point) =>
            point.id ? [point.id] : [],
          );
          const retainedPointIdSet = new Set(retainedPointIds);

          if (
            retainedPointIds.length !== retainedPointIdSet.size ||
            retainedPointIds.some((pointId) => !existingPointIds.has(pointId))
          ) {
            throw new ORPCError('BAD_REQUEST', {
              message: 'Um ou mais pontos de coleta não pertencem à campanha.',
            });
          }

          await transaction.campaignCollectionPoint.deleteMany({
            where: {
              campaignId: input.id,
              ...(retainedPointIds.length ? { id: { notIn: retainedPointIds } } : {}),
            },
          });

          await Promise.all(
            input.collectionPoints.flatMap((point) =>
              point.id
                ? [
                    transaction.campaignCollectionPoint.update({
                      where: { id: point.id },
                      data: toCampaignCollectionPointFields(point),
                    }),
                  ]
                : [],
            ),
          );

          const newPointData = toCampaignCollectionPointData(
            {
              ...input,
              collectionPoints: input.collectionPoints.filter((point) => !point.id),
            },
            input.id,
          );
          if (newPointData.length) {
            await transaction.campaignCollectionPoint.createMany({ data: newPointData });
          }
        }

        const updatedCampaign = await transaction.campaign.findFirst({
          where: {
            id: input.id,
            organizerProfile: { userId: user.id },
          },
          include: campaignInclude,
        });

        if (!updatedCampaign) {
          throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
        }

        const { _count, ...campaignData } = updatedCampaign;
        return { ...campaignData, participantCount: _count.participants };
      }),
    ),

  publishUpdate: authorized
    .input(campaignPublishUpdateInputSchema)
    .handler(async ({ input, context: { user } }) =>
      prisma.$transaction(async (transaction) => {
        await transaction.$queryRaw(
          Prisma.sql`SELECT "id" FROM "campaigns" WHERE "id" = ${input.id} FOR UPDATE`,
        );

        const campaign = await transaction.campaign.findFirst({
          where: {
            id: input.id,
            organizerProfile: { userId: user.id },
          },
          select: { status: true },
        });

        if (!campaign) {
          throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
        }

        assertCampaignIsActive(campaign);

        return transaction.campaignUpdate.create({
          data: {
            campaignId: input.id,
            authorId: user.id,
            message: input.message,
          },
          select: {
            id: true,
            message: true,
            publishedAt: true,
          },
        });
      }),
    ),

  transitionLifecycle: authorized
    .input(campaignLifecycleTransitionInputSchema)
    .handler(async ({ input, context: { user } }) =>
      prisma.$transaction(async (transaction) => {
        const campaign = await transaction.campaign.findFirst({
          where: {
            id: input.id,
            organizerProfile: { userId: user.id },
          },
          select: { status: true },
        });

        if (!campaign) {
          throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
        }

        assertCampaignIsActive(campaign);

        const transitionedAt = new Date();
        const result = await transaction.campaign.updateMany({
          where: { id: input.id, status: 'ACTIVE' },
          data:
            input.status === 'COMPLETED'
              ? { status: 'COMPLETED', completedAt: transitionedAt }
              : { status: 'CANCELLED', cancelledAt: transitionedAt },
        });

        if (!result.count) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'A campanha não está mais ativa para alterar o ciclo de vida.',
          });
        }

        return { status: input.status, transitionedAt };
      }),
    ),

  create: authorized
    .input(campaignCreateInputSchema)
    .handler(async ({ input, context: { user } }) => {
      const organizerProfile = await prisma.organizerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!organizerProfile) {
        throw new ORPCError('FORBIDDEN', {
          message: 'Você precisa configurar um perfil organizador antes de criar campanhas.',
        });
      }

      const { startDate, endDate } = assertCreateInput(input);

      return prisma.campaign.create({
        data: toCampaignCreateData(input, organizerProfile.id, { startDate, endDate }),
        include: campaignInclude,
      });
    }),
};
