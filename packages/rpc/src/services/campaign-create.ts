import { CampaignType, type CampaignCreateInput } from '@lumos/validation/campaign';

type CampaignDates = {
  startDate: Date;
  endDate: Date;
};

export function toCampaignCreateData(
  input: CampaignCreateInput,
  organizerProfileId: string,
  dates: CampaignDates,
) {
  const commonData = {
    organizerProfileId,
    title: input.title,
    description: input.description,
    status: 'ACTIVE' as const,
    type: input.type,
    category: input.category,
    region: input.region,
    ...dates,
  };

  switch (input.type) {
    case CampaignType.PHYSICAL:
      return {
        ...commonData,
        location: input.location,
        targetItems: input.targetItems,
        currentItems: 0,
        pixKey: null,
        bankAccountInfo: null,
        collectionPoints: {
          create: input.collectionPoints.map((point) => ({
            name: point.name,
            address: point.address,
            city: point.city,
            state: point.state,
            zipCode: point.zipCode,
            instructions: point.instructions || null,
          })),
        },
      };

    case CampaignType.VIRTUAL:
      return {
        ...commonData,
        location: null,
        targetItems: null,
        currentItems: null,
        pixKey: input.pixKey || null,
        bankAccountInfo: input.bankAccountInfo || null,
      };

    default:
      return assertNever(input);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unsupported campaign type: ${JSON.stringify(value)}`);
}
