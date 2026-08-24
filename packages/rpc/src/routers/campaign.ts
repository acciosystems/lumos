import { prisma } from '@lumos/database';
import type { CampaignInclude, CampaignSelect } from '@lumos/database/generated/prisma/models';
import {
  CampaignType,
  campaignByIdInputSchema,
  campaignCreateInputSchema,
  campaignListInputSchema,
  type CampaignCreateInput,
} from '@lumos/validation/campaign';
import { ORPCError } from '@orpc/client';
import * as v from 'valibot';

import { authorized, publicProcedure } from '../procedures';
import { toCampaignCreateData } from '../services/campaign-create';

const activeParticipantWhere = { cancelledAt: null } as const;

const campaignInclude = {
  organizerProfile: {
    select: {
      id: true,
      type: true,
      displayName: true,
      cnpj: true,
    },
  },
  collectionPoints: {
    orderBy: { createdAt: 'asc' as const },
  },
  updates: {
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
      orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
    });

    return campaigns.map(withParticipantCount);
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

    return prisma.campaign.findMany({
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
