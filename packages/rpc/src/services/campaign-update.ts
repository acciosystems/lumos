import { CampaignType, type CampaignDetailsUpdateInput } from '@lumos/validation/campaign';

type CampaignDates = {
  startDate: Date;
  endDate: Date;
};

type CampaignCollectionPointInput = Extract<
  CampaignDetailsUpdateInput,
  { type: 'PHYSICAL' }
>['collectionPoints'][number];

export function toCampaignUpdateData(input: CampaignDetailsUpdateInput, dates: CampaignDates) {
  const commonData = {
    title: input.title,
    description: input.description,
    category: input.category,
    region: input.region,
    ...dates,
  };

  if (input.type === CampaignType.PHYSICAL) {
    return {
      ...commonData,
      location: input.location,
      targetItems: input.targetItems,
      pixKey: null,
      bankAccountInfo: null,
    };
  }

  return {
    ...commonData,
    location: null,
    targetItems: null,
    pixKey: input.pixKey || null,
    bankAccountInfo: input.bankAccountInfo || null,
  };
}

export function toCampaignCollectionPointData(
  input: Extract<CampaignDetailsUpdateInput, { type: 'PHYSICAL' }>,
  campaignId: string,
) {
  return input.collectionPoints.map((point) => ({
    campaignId,
    ...toCampaignCollectionPointFields(point),
  }));
}

export function toCampaignCollectionPointFields(point: CampaignCollectionPointInput) {
  return {
    name: point.name,
    address: point.address,
    city: point.city,
    state: point.state,
    zipCode: point.zipCode,
    instructions: point.instructions || null,
  };
}
