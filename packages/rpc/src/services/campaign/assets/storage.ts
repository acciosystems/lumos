import { CAMPAIGN_ASSET_UPLOAD_EXPIRES_IN_SECONDS } from '@lumos/validation/campaign';

import { createSingleWriteUploadUrl, publishUploadObject } from '../../upload/storage';

export {
  deleteUploadObject as deleteCampaignAssetObject,
  getPublicObjectUrl as getAssetPublicUrl,
  headUploadObject as headCampaignAssetObject,
  isUploadObjectNotFound as isCampaignAssetObjectNotFound,
} from '../../upload/storage';

export function getCampaignAssetStagingKey(userId: string, uploadId: string, contentType: string) {
  return `campaign-assets/staging/${userId}/${uploadId}.${extensionFor(contentType)}`;
}

export function getCampaignAssetPublishedKey({
  campaignId,
  uploadId,
  contentType,
  kind,
}: {
  campaignId: string;
  uploadId: string;
  contentType: string;
  kind: 'IMAGE' | 'ACCOUNTABILITY_EVIDENCE';
}) {
  const namespace = kind === 'IMAGE' ? 'image' : 'accountability';
  return `campaigns/${campaignId}/${namespace}/${uploadId}.${extensionFor(contentType)}`;
}

export async function createCampaignAssetUploadUrl(stagingKey: string, contentType: string) {
  return createSingleWriteUploadUrl({
    key: stagingKey,
    contentType,
    expiresIn: CAMPAIGN_ASSET_UPLOAD_EXPIRES_IN_SECONDS,
  });
}

export async function publishCampaignAssetObject(
  {
    sourceKey,
    destinationKey,
    sourceEtag,
    contentType,
    originalFileName,
  }: {
    sourceKey: string;
    destinationKey: string;
    sourceEtag: string;
    contentType: string;
    originalFileName: string;
  },
  signal?: AbortSignal,
) {
  const disposition = contentType === 'application/pdf' ? 'attachment' : 'inline';
  return publishUploadObject(
    {
      sourceKey,
      destinationKey,
      sourceEtag,
      contentType,
      contentDisposition: `${disposition}; filename="download"; filename*=UTF-8''${encodeURIComponent(originalFileName)}`,
      cacheControl: 'public, max-age=31536000, immutable',
    },
    signal,
  );
}

function extensionFor(contentType: string) {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
  };
  const extension = extensions[contentType];
  if (!extension) throw new Error(`Unsupported campaign asset content type: ${contentType}`);
  return extension;
}
