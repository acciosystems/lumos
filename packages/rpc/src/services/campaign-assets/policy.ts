import {
  CAMPAIGN_EVIDENCE_CONTENT_TYPES,
  CAMPAIGN_EVIDENCE_MAX_SIZE_BYTES,
  CAMPAIGN_IMAGE_CONTENT_TYPE,
  CAMPAIGN_IMAGE_MAX_SIZE_BYTES,
} from '@lumos/validation/campaign';

export function isValidCampaignAssetObject({
  kind,
  contentLength,
  contentType,
  expectedLength,
  expectedType,
  maxSize,
}: {
  kind: 'IMAGE' | 'ACCOUNTABILITY_EVIDENCE';
  contentLength: number | undefined;
  contentType: string | undefined;
  expectedLength: number;
  expectedType: string;
  maxSize: number;
}) {
  const allowed =
    kind === 'IMAGE'
      ? contentType === CAMPAIGN_IMAGE_CONTENT_TYPE && maxSize <= CAMPAIGN_IMAGE_MAX_SIZE_BYTES
      : CAMPAIGN_EVIDENCE_CONTENT_TYPES.includes(
          contentType as (typeof CAMPAIGN_EVIDENCE_CONTENT_TYPES)[number],
        ) && maxSize <= CAMPAIGN_EVIDENCE_MAX_SIZE_BYTES;

  return (
    allowed &&
    contentType === expectedType &&
    typeof contentLength === 'number' &&
    contentLength > 0 &&
    contentLength === expectedLength &&
    contentLength <= maxSize
  );
}

export function isOwnedCampaignAssetIntent({
  intent,
  userId,
  kind,
  campaignId,
}: {
  intent: { userId: string; purpose: string; targetCampaignId: string | null };
  userId: string;
  kind?: 'IMAGE' | 'ACCOUNTABILITY_EVIDENCE';
  campaignId?: string;
}) {
  const expectedPurpose =
    kind === 'IMAGE'
      ? 'CAMPAIGN_IMAGE'
      : kind === 'ACCOUNTABILITY_EVIDENCE'
        ? 'ACCOUNTABILITY_EVIDENCE'
        : null;
  return (
    intent.userId === userId &&
    ['CAMPAIGN_IMAGE', 'ACCOUNTABILITY_EVIDENCE'].includes(intent.purpose) &&
    (!expectedPurpose || intent.purpose === expectedPurpose) &&
    (campaignId === undefined || intent.targetCampaignId === campaignId)
  );
}
