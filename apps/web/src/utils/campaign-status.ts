import { CampaignStatus } from '@lumos/validation/campaign';

type CampaignStatusMetadata = {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
};

export const campaignStatusMetadata = {
  [CampaignStatus.PENDING]: { label: 'Pendente', variant: 'secondary' },
  [CampaignStatus.ACTIVE]: { label: 'Ativa', variant: 'default' },
  [CampaignStatus.COMPLETED]: { label: 'Concluída', variant: 'outline' },
  [CampaignStatus.CANCELLED]: { label: 'Cancelada', variant: 'destructive' },
} satisfies Record<CampaignStatus, CampaignStatusMetadata>;
