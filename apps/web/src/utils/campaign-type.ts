import { CampaignType } from '@lumos/validation/campaign';

type CampaignTypeMetadata = {
  label: string;
  campaignLabel: string;
  formLabel: string;
};

export const campaignTypeMetadata = {
  [CampaignType.PHYSICAL]: {
    label: 'Física',
    campaignLabel: 'Campanha física',
    formLabel: 'Física — coleta de itens',
  },
  [CampaignType.VIRTUAL]: {
    label: 'Virtual',
    campaignLabel: 'Campanha virtual',
    formLabel: 'Virtual — doação financeira',
  },
} satisfies Record<CampaignType, CampaignTypeMetadata>;

export const campaignTypeValues = Object.values(CampaignType);

export function isPhysicalCampaign(type: CampaignType): boolean {
  switch (type) {
    case CampaignType.PHYSICAL:
      return true;
    case CampaignType.VIRTUAL:
      return false;
    default:
      return assertNever(type);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unsupported campaign type: ${String(value)}`);
}
