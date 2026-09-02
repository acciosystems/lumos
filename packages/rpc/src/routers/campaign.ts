import { prisma } from '@lumos/database';
import { CampaignOperationKind, Prisma } from '@lumos/database/generated/prisma/client';
import type { CampaignInclude, CampaignSelect } from '@lumos/database/generated/prisma/models';
import {
  CampaignStatus,
  CampaignType,
  CAMPAIGN_COLLECTION_POINT_MAX_COUNT,
  CAMPAIGN_EVIDENCE_MAX_COUNT,
  campaignAssetUploadIdInputSchema,
  campaignAssetUploadInputSchema,
  campaignByIdInputSchema,
  campaignCreateInputSchema,
  campaignLifecycleTransitionInputSchema,
  campaignListInputSchema,
  campaignPageInputSchema,
  campaignAccountabilityInputSchema,
  campaignDetailsUpdateInputSchema,
  campaignPublishUpdateInputSchema,
  campaignProgressUpdateInputSchema,
  type CampaignCreateInput,
} from '@lumos/validation/campaign';
import { ORPCError } from '@orpc/client';
import * as v from 'valibot';

import {
  assertForegroundDeadline,
  runDatabaseTransaction,
  withCompensationDeadline,
} from '../deadline';
import { authorized, publicProcedure } from '../procedures';
import {
  assertCampaignDatesNotEnded,
  cleanupRemovedCampaignAssets,
  compensatePreparedCampaignAssets,
  confirmPreparedCampaignAsset,
  createCampaignAssetUploadIntent,
  discardCampaignAssetUpload,
  finishPreparedCampaignAssets,
  getCampaignAccountabilityDeadline,
  getCampaignAccountabilityStatus,
  getEffectiveCampaignStatus,
  getSaoPauloCalendarDate,
  prepareCampaignAssetUploads,
  reconcileCampaignLifecycle,
  reserveCampaignOperation,
  saveCampaignAccountability,
  toCampaignCollectionPointData,
  toCampaignCollectionPointFields,
  toCampaignCreateData,
  toCampaignUpdateData,
  toPublicCampaignAccountability,
  type PreparedCampaignAsset,
  toPublicCampaignAsset,
  verifyCampaignAssetUpload,
} from '../services/campaign';

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
    take: CAMPAIGN_COLLECTION_POINT_MAX_COUNT,
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
  accountability: {
    include: {
      evidenceAssets: {
        where: { removedAt: null },
        orderBy: [{ position: 'asc' as const }, { createdAt: 'asc' as const }],
        take: CAMPAIGN_EVIDENCE_MAX_COUNT,
      },
    },
  },
  assets: {
    where: { kind: 'IMAGE' as const, removedAt: null },
    orderBy: { createdAt: 'desc' as const },
    take: 1,
  },
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
  status: true,
  type: true,
  category: true,
  region: true,
  startDate: true,
  endDate: true,
  assets: {
    where: { kind: 'IMAGE' as const, removedAt: null },
    select: {
      id: true,
      objectKey: true,
      originalFileName: true,
      contentType: true,
      contentLength: true,
    },
    take: 1,
  },
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
    take: CAMPAIGN_COLLECTION_POINT_MAX_COUNT,
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
  accountability: {
    select: {
      totalItems: true,
      totalAmountCents: true,
      outcomeSummary: true,
      evidenceAssets: {
        where: { removedAt: null },
        orderBy: [{ position: 'asc' as const }, { createdAt: 'asc' as const }],
        select: {
          id: true,
          objectKey: true,
          originalFileName: true,
          contentType: true,
          contentLength: true,
        },
        take: CAMPAIGN_EVIDENCE_MAX_COUNT,
      },
    },
  },
} as const satisfies CampaignSelect;

const ownerCampaignListSelect = {
  id: true,
  title: true,
  status: true,
  type: true,
  category: true,
  region: true,
  startDate: true,
  endDate: true,
  targetItems: true,
  currentItems: true,
  _count: {
    select: {
      participants: {
        where: activeParticipantWhere,
      },
    },
  },
} as const satisfies CampaignSelect;

const participatingCampaignListSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  type: true,
  category: true,
  region: true,
  startDate: true,
  endDate: true,
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

function withParticipantCount<
  Campaign extends {
    _count: { participants: number };
    assets: Array<Parameters<typeof toPublicCampaignAsset>[0]>;
  },
>(campaign: Campaign) {
  const { _count, assets, ...campaignData } = campaign;
  return {
    ...campaignData,
    image: assets[0] ? toPublicCampaignAsset(assets[0]) : null,
    participantCount: _count.participants,
  };
}

function withEffectiveCampaignStatus<
  Campaign extends { status: CampaignStatus; startDate: Date; endDate: Date },
>(campaign: Campaign, now = new Date()) {
  return {
    ...campaign,
    status: getEffectiveCampaignStatus({ ...campaign, now }),
  };
}

function withCampaignParticipantCount<Campaign extends { _count: { participants: number } }>(
  campaign: Campaign,
) {
  const { _count, ...campaignData } = campaign;
  return { ...campaignData, participantCount: _count.participants };
}

function withOwnerCampaignData(
  campaign: Prisma.CampaignGetPayload<{ include: typeof campaignInclude }>,
) {
  const { _count, accountability, assets, ...campaignData } = campaign;
  const effectiveCampaign = withEffectiveCampaignStatus(campaignData);
  const deadline =
    effectiveCampaign.status === 'COMPLETED'
      ? getCampaignAccountabilityDeadline(campaign.endDate)
      : null;

  return {
    ...effectiveCampaign,
    image: assets[0] ? toPublicCampaignAsset(assets[0]) : null,
    accountability: accountability
      ? {
          ...accountability,
          evidenceAssets: accountability.evidenceAssets.map(toPublicCampaignAsset),
        }
      : null,
    participantCount: _count.participants,
    accountabilityDeadline: deadline,
    accountabilityStatus: getCampaignAccountabilityStatus({
      campaignStatus: effectiveCampaign.status,
      accountability: campaign.accountability,
      deadline,
    }),
  };
}

function assertCampaignAcceptsParticipation(campaign: {
  type: 'PHYSICAL' | 'VIRTUAL';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startDate: Date;
  endDate: Date;
}) {
  if (campaign.type !== 'PHYSICAL') {
    throw new ORPCError('BAD_REQUEST', {
      message: 'Somente campanhas físicas aceitam participantes.',
    });
  }

  if (getEffectiveCampaignStatus(campaign) !== 'ACTIVE') {
    throw new ORPCError('BAD_REQUEST', {
      message: 'A campanha precisa estar ativa para alterar a participação.',
    });
  }
}

function assertCampaignIsActive(campaign: {
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startDate: Date;
  endDate: Date;
}) {
  if (getEffectiveCampaignStatus(campaign) !== 'ACTIVE') {
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

function todayAsDate(now = new Date()) {
  return new Date(`${getSaoPauloCalendarDate(now)}T00:00:00.000Z`);
}

async function lockAndReconcileCampaign(transaction: Prisma.TransactionClient, campaignId: string) {
  await transaction.$queryRaw(
    Prisma.sql`SELECT "id" FROM "campaigns" WHERE "id" = ${campaignId} FOR UPDATE`,
  );
  await reconcileCampaignLifecycle(transaction, campaignId);
}

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

  if (!assertCampaignDatesNotEnded(startDate, endDate)) {
    throw new ORPCError('BAD_REQUEST', {
      message: 'A data final não pode estar no passado.',
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

  return {
    startDate,
    endDate,
    status: getEffectiveCampaignStatus({
      status: 'ACTIVE',
      startDate,
      endDate,
    }),
  };
}

export const campaignRouter = {
  list: publicProcedure.input(campaignListInputSchema).handler(async ({ input }) => {
    const now = new Date();
    const today = todayAsDate(now);
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: { in: [CampaignStatus.ACTIVE, CampaignStatus.PENDING] },
        startDate: { lte: today },
        endDate: { gte: today },
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
    const items = campaigns
      .slice(0, input.limit)
      .map((campaign) => withEffectiveCampaignStatus(withParticipantCount(campaign), now));

    return {
      items,
      nextCursor: hasNextPage ? (items.at(-1)?.id ?? null) : null,
    };
  }),

  publicById: publicProcedure.input(campaignByIdInputSchema).handler(async ({ input }) => {
    const now = new Date();
    const today = todayAsDate(now);
    const campaign = await runDatabaseTransaction(async (transaction) => {
      await reconcileCampaignLifecycle(transaction, input.id, now);
      return transaction.campaign.findFirst({
        where: {
          id: input.id,
          OR: [
            { status: CampaignStatus.COMPLETED },
            { status: CampaignStatus.ACTIVE, startDate: { lte: today }, endDate: { gte: today } },
          ],
        },
        select: publicCampaignDetailSelect,
      });
    });

    if (!campaign) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Campanha não encontrada ou não está disponível publicamente.',
      });
    }

    const publicCampaign = withParticipantCount(withEffectiveCampaignStatus(campaign, now));
    return {
      ...publicCampaign,
      accountability: toPublicCampaignAccountability(campaign.accountability),
      ...(publicCampaign.status === 'COMPLETED' ? { pixKey: null, bankAccountInfo: null } : {}),
    };
  }),

  byId: authorized.input(campaignByIdInputSchema).handler(async ({ input, context: { user } }) => {
    await runDatabaseTransaction(async (transaction) => {
      await lockAndReconcileCampaign(transaction, input.id);
    });
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

    return withOwnerCampaignData(campaign);
  }),

  myCampaigns: authorized
    .input(campaignPageInputSchema)
    .handler(async ({ input, context: { user } }) => {
      const organizerProfile = await prisma.organizerProfile.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });

      if (!organizerProfile) return { items: [], nextCursor: null };

      const campaigns = await prisma.campaign.findMany({
        where: {
          organizerProfileId: organizerProfile.id,
        },
        select: ownerCampaignListSelect,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
        take: input.limit + 1,
      });

      const hasNextPage = campaigns.length > input.limit;
      const items = campaigns
        .slice(0, input.limit)
        .map((campaign) => withEffectiveCampaignStatus(withCampaignParticipantCount(campaign)));

      return {
        items,
        nextCursor: hasNextPage ? (items.at(-1)?.id ?? null) : null,
      };
    }),

  myParticipations: authorized
    .input(campaignPageInputSchema)
    .handler(async ({ input, context: { user } }) => {
      const now = new Date();
      const today = todayAsDate(now);
      const participations = await prisma.campaignParticipant.findMany({
        where: {
          userId: user.id,
          ...activeParticipantWhere,
          campaign: {
            status: { in: [CampaignStatus.ACTIVE, CampaignStatus.PENDING] },
            type: 'PHYSICAL',
            startDate: { lte: today },
            endDate: { gte: today },
          },
        },
        select: {
          id: true,
          campaign: {
            select: participatingCampaignListSelect,
          },
        },
        orderBy: [{ confirmedAt: 'desc' }, { id: 'desc' }],
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
        take: input.limit + 1,
      });

      const hasNextPage = participations.length > input.limit;
      const items = participations
        .slice(0, input.limit)
        .map(({ campaign }) =>
          withEffectiveCampaignStatus(withCampaignParticipantCount(campaign), now),
        );

      return {
        items,
        nextCursor: hasNextPage ? (participations.at(input.limit - 1)?.id ?? null) : null,
      };
    }),

  participationState: authorized
    .input(campaignByIdInputSchema)
    .handler(async ({ input, context: { user } }) => {
      const now = new Date();
      const state = await runDatabaseTransaction(async (transaction) => {
        await reconcileCampaignLifecycle(transaction, input.id, now);
        const campaign = await transaction.campaign.findUnique({
          where: { id: input.id },
          select: { status: true, startDate: true, endDate: true },
        });
        if (
          !campaign ||
          getEffectiveCampaignStatus({ ...campaign, now }) !== CampaignStatus.ACTIVE
        ) {
          return false;
        }
        const participant = await transaction.campaignParticipant.findUnique({
          where: { campaignId_userId: { campaignId: input.id, userId: user.id } },
          select: { cancelledAt: true },
        });
        return participant?.cancelledAt === null;
      });

      return { isParticipating: state };
    }),

  canCreate: authorized.handler(async ({ context: { user } }) => {
    const organizerProfile = await prisma.organizerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    return { hasOrganizerProfile: Boolean(organizerProfile) };
  }),

  assetUpload: {
    createIntent: authorized
      .input(campaignAssetUploadInputSchema)
      .handler(async ({ input, context: { user, log } }) =>
        createCampaignAssetUploadIntent({ input, userId: user.id, log }),
      ),
    verify: authorized
      .input(campaignAssetUploadIdInputSchema)
      .handler(async ({ input, context: { user, log } }) =>
        verifyCampaignAssetUpload({ uploadId: input.uploadId, userId: user.id, log }),
      ),
    discard: authorized
      .input(campaignAssetUploadIdInputSchema)
      .handler(async ({ input, context: { user, log } }) =>
        discardCampaignAssetUpload({ uploadId: input.uploadId, userId: user.id, log }),
      ),
  },

  join: authorized.input(campaignByIdInputSchema).handler(async ({ input, context: { user } }) =>
    runDatabaseTransaction(async (transaction) => {
      await lockAndReconcileCampaign(transaction, input.id);

      const campaign = await transaction.campaign.findUnique({
        where: { id: input.id },
        select: { status: true, type: true, startDate: true, endDate: true },
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
      runDatabaseTransaction(async (transaction) => {
        await lockAndReconcileCampaign(transaction, input.id);
        const campaign = await transaction.campaign.findUnique({
          where: { id: input.id },
          select: { status: true, type: true, startDate: true, endDate: true },
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
      runDatabaseTransaction(async (transaction) => {
        await lockAndReconcileCampaign(transaction, input.id);
        const campaign = await transaction.campaign.findFirst({
          where: {
            id: input.id,
            organizerProfile: { userId: user.id },
          },
          select: { status: true, type: true, startDate: true, endDate: true },
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

        const today = todayAsDate();
        const result = await transaction.campaign.updateMany({
          where: {
            id: input.id,
            status: 'ACTIVE',
            type: 'PHYSICAL',
            startDate: { lte: today },
            endDate: { gte: today },
          },
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
      runDatabaseTransaction(async (transaction) => {
        await lockAndReconcileCampaign(transaction, input.id);

        const campaign = await transaction.campaign.findFirst({
          where: {
            id: input.id,
            organizerProfile: { userId: user.id },
          },
          select: { status: true, type: true, startDate: true, endDate: true },
        });

        if (!campaign) {
          throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
        }

        if (
          campaign.status !== CampaignStatus.PENDING &&
          campaign.status !== CampaignStatus.ACTIVE
        ) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'A campanha não pode mais ser editada.',
          });
        }

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

        if (!assertCampaignDatesNotEnded(startDate, endDate)) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'A data final não pode estar no passado.',
          });
        }

        if (
          getEffectiveCampaignStatus(campaign) === CampaignStatus.ACTIVE &&
          getEffectiveCampaignStatus({ status: CampaignStatus.ACTIVE, startDate, endDate }) !==
            CampaignStatus.ACTIVE
        ) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'Uma campanha ativa deve continuar abrangendo a data atual.',
          });
        }

        const today = todayAsDate();
        const nextStatus = getEffectiveCampaignStatus({
          status: CampaignStatus.ACTIVE,
          startDate,
          endDate,
        });
        const result = await transaction.campaign.updateMany({
          where: {
            id: input.id,
            status: { in: [CampaignStatus.PENDING, CampaignStatus.ACTIVE] },
            type: input.type,
            endDate: { gte: today },
          },
          data: { ...toCampaignUpdateData(input, { startDate, endDate }), status: nextStatus },
        });

        if (!result.count) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'A campanha não está mais ativa para editar seus detalhes.',
          });
        }

        if (input.type === CampaignType.PHYSICAL) {
          const collectionPointCount = await transaction.campaignCollectionPoint.count({
            where: { campaignId: input.id },
          });

          if (collectionPointCount > CAMPAIGN_COLLECTION_POINT_MAX_COUNT) {
            throw new ORPCError('BAD_REQUEST', {
              message:
                'Esta campanha excede o limite atual de pontos de coleta e não pode ser editada.',
            });
          }

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
    .handler(async ({ input, context: { user, log } }) => {
      const { operationKey, ...payload } = input;
      const reservation = await reserveCampaignOperation({
        actorId: user.id,
        kind: CampaignOperationKind.PUBLISH_UPDATE,
        operationKey,
        payload,
        log,
      });

      if (reservation.replay) {
        const existingUpdate = await prisma.campaignUpdate.findFirst({
          where: { id: reservation.resourceId, authorId: user.id },
          select: { id: true, message: true, publishedAt: true },
        });
        if (existingUpdate) return existingUpdate;
      }

      try {
        const update = await runDatabaseTransaction(async (transaction) => {
          await lockAndReconcileCampaign(transaction, input.id);

          const campaign = await transaction.campaign.findFirst({
            where: {
              id: input.id,
              organizerProfile: { userId: user.id },
            },
            select: { status: true, startDate: true, endDate: true },
          });

          if (!campaign) {
            throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
          }

          assertCampaignIsActive(campaign);

          return transaction.campaignUpdate.create({
            data: {
              id: reservation.resourceId,
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
        });
        log?.set({ idempotencyOutcome: 'committed' });
        return update;
      } catch (error) {
        const committedUpdate = await prisma.campaignUpdate.findFirst({
          where: { id: reservation.resourceId, authorId: user.id },
          select: { id: true, message: true, publishedAt: true },
        });
        if (committedUpdate) {
          log?.set({ idempotencyOutcome: 'committed' });
          return committedUpdate;
        }
        throw error;
      }
    }),

  transitionLifecycle: authorized
    .input(campaignLifecycleTransitionInputSchema)
    .handler(async ({ input, context: { user } }) =>
      runDatabaseTransaction(async (transaction) => {
        await lockAndReconcileCampaign(transaction, input.id);
        const campaign = await transaction.campaign.findFirst({
          where: {
            id: input.id,
            organizerProfile: { userId: user.id },
          },
          select: { status: true, startDate: true, endDate: true },
        });

        if (!campaign) {
          throw new ORPCError('NOT_FOUND', { message: 'Campanha não encontrada.' });
        }

        const effectiveStatus = getEffectiveCampaignStatus(campaign);
        if (
          input.status === CampaignStatus.COMPLETED
            ? effectiveStatus !== CampaignStatus.ACTIVE
            : effectiveStatus !== CampaignStatus.PENDING &&
              effectiveStatus !== CampaignStatus.ACTIVE
        ) {
          throw new ORPCError('BAD_REQUEST', {
            message:
              input.status === CampaignStatus.COMPLETED
                ? 'A campanha precisa estar ativa para ser concluída.'
                : 'A campanha precisa estar pendente ou ativa para ser cancelada.',
          });
        }

        const transitionedAt = new Date();
        const today = todayAsDate();
        const result = await transaction.campaign.updateMany({
          where: {
            id: input.id,
            status: { in: [CampaignStatus.PENDING, CampaignStatus.ACTIVE] },
            endDate: { gte: today },
            ...(input.status === CampaignStatus.COMPLETED ? { startDate: { lte: today } } : {}),
          },
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

  saveAccountability: authorized
    .input(campaignAccountabilityInputSchema)
    .handler(async ({ input, context: { user, log, deadline } }) => {
      const prepared = await prepareCampaignAssetUploads({
        uploadIds: input.evidenceUploadIds,
        userId: user.id,
        campaignId: input.id,
        kind: 'ACCOUNTABILITY_EVIDENCE',
        log,
        deadline,
      });
      try {
        assertForegroundDeadline(deadline, 'accountability_before_transaction');
        const accountability = await runDatabaseTransaction((transaction) =>
          saveCampaignAccountability(transaction, user.id, input, prepared),
        );
        await withCompensationDeadline(deadline, async () => {
          await finishPreparedCampaignAssets(prepared, log, deadline.compensationSignal);
          await cleanupRemovedCampaignAssets(user.id, log, deadline.compensationSignal);
        });
        return toPublicCampaignAccountability(accountability);
      } catch (error) {
        await withCompensationDeadline(deadline, () =>
          compensatePreparedCampaignAssets(prepared, log, deadline.compensationSignal),
        );
        throw error;
      }
    }),

  create: authorized
    .input(campaignCreateInputSchema)
    .handler(async ({ input, context: { user, log, deadline } }) => {
      const organizerProfile = await prisma.organizerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!organizerProfile) {
        throw new ORPCError('FORBIDDEN', {
          message: 'Você precisa configurar um perfil organizador antes de criar campanhas.',
        });
      }

      const { operationKey, ...payload } = input;
      const reservation = await reserveCampaignOperation({
        actorId: user.id,
        kind: CampaignOperationKind.CREATE,
        operationKey,
        payload,
        log,
      });

      if (reservation.replay) {
        const existingCampaign = await prisma.campaign.findFirst({
          where: {
            id: reservation.resourceId,
            organizerProfile: { userId: user.id },
          },
          include: campaignInclude,
        });
        if (existingCampaign) return withOwnerCampaignData(existingCampaign);
      }

      const { startDate, endDate, status } = assertCreateInput(input);
      const campaignId = reservation.resourceId;
      let prepared: PreparedCampaignAsset[] = [];

      try {
        prepared = input.imageUploadId
          ? await prepareCampaignAssetUploads({
              uploadIds: [input.imageUploadId],
              userId: user.id,
              campaignId,
              kind: 'IMAGE',
              log,
              deadline,
            })
          : [];

        const campaign = await runDatabaseTransaction(async (transaction) => {
          await transaction.campaign.create({
            data: {
              id: campaignId,
              ...toCampaignCreateData(input, organizerProfile.id, { startDate, endDate }, status),
            },
          });
          if (prepared[0]) {
            await confirmPreparedCampaignAsset({
              transaction,
              prepared: prepared[0],
              campaignId,
              userId: user.id,
              position: 0,
            });
          }
          return transaction.campaign.findUniqueOrThrow({
            where: { id: campaignId },
            include: campaignInclude,
          });
        });
        await withCompensationDeadline(deadline, () =>
          finishPreparedCampaignAssets(prepared, log, deadline.compensationSignal),
        );
        log.set({ idempotencyOutcome: 'committed' });
        return withOwnerCampaignData(campaign);
      } catch (error) {
        const committedCampaign = await withCompensationDeadline(deadline, () =>
          prisma.campaign.findFirst({
            where: {
              id: campaignId,
              organizerProfile: { userId: user.id },
            },
            include: campaignInclude,
          }),
        );
        if (committedCampaign) {
          await withCompensationDeadline(deadline, () =>
            finishPreparedCampaignAssets(prepared, log, deadline.compensationSignal),
          );
          log.set({ idempotencyOutcome: 'committed' });
          return withOwnerCampaignData(committedCampaign);
        }
        await withCompensationDeadline(deadline, () =>
          compensatePreparedCampaignAssets(prepared, log, deadline.compensationSignal),
        );
        throw error;
      }
    }),
};
