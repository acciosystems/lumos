import { prisma } from '@lumos/database';
import {
  campaignByIdInputSchema,
  campaignCreateInputSchema,
  campaignListInputSchema,
  type CampaignCreateInput,
} from '@lumos/validation/campaign';
import { ORPCError } from '@orpc/client';
import * as v from 'valibot';

import { authorized } from '../procedures';

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
      participants: true,
    },
  },
};

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

  if (input.type === 'PHYSICAL') {
    if (!input.location || !input.targetItems || !input.collectionPoints?.length) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Campanhas físicas precisam de local, meta de itens e ponto de coleta.',
      });
    }
  }

  if (input.type === 'VIRTUAL' && !input.pixKey && !input.bankAccountInfo) {
    throw new ORPCError('BAD_REQUEST', {
      message: 'Campanhas virtuais precisam de uma chave PIX ou dados bancários.',
    });
  }

  return { startDate, endDate };
}

export const campaignRouter = {
  list: authorized.input(campaignListInputSchema).handler(async ({ input }) => {
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'ACTIVE',
        ...(input.category ? { category: { contains: input.category, mode: 'insensitive' } } : {}),
        ...(input.region ? { region: { contains: input.region, mode: 'insensitive' } } : {}),
        ...(input.type ? { type: input.type } : {}),
      },
      include: {
        organizerProfile: {
          select: {
            displayName: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
    });

    return campaigns.map(({ _count, ...campaign }) =>
      Object.assign(campaign, { participantCount: _count.participants }),
    );
  }),

  byId: authorized.input(campaignByIdInputSchema).handler(async ({ input, context: { user } }) => {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: input.id,
        OR: [{ status: 'ACTIVE' }, { organizerProfile: { userId: user.id } }],
      },
      include: campaignInclude,
    });

    if (!campaign) {
      throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada ou não está ativa.' });
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
            participants: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });
  }),

  canCreate: authorized.handler(async ({ context: { user } }) => {
    const organizerProfile = await prisma.organizerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    return { hasOrganizerProfile: Boolean(organizerProfile) };
  }),

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
        data: {
          organizerProfileId: organizerProfile.id,
          title: input.title,
          description: input.description,
          status: 'ACTIVE',
          type: input.type,
          category: input.category,
          region: input.region,
          startDate,
          endDate,
          imageUrl: input.imageUrl || null,
          location: input.type === 'PHYSICAL' ? input.location : null,
          targetItems: input.type === 'PHYSICAL' ? input.targetItems : null,
          currentItems: input.type === 'PHYSICAL' ? 0 : null,
          pixKey: input.type === 'VIRTUAL' ? input.pixKey || null : null,
          bankAccountInfo: input.type === 'VIRTUAL' ? input.bankAccountInfo || null : null,
          collectionPoints:
            input.type === 'PHYSICAL'
              ? {
                  create: input.collectionPoints?.map((point) => ({
                    name: point.name,
                    address: point.address,
                    city: point.city,
                    state: point.state,
                    zipCode: point.zipCode,
                    instructions: point.instructions || null,
                  })),
                }
              : undefined,
        },
        include: campaignInclude,
      });
    }),
};
