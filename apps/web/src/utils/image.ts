import { CAMPAIGN_IMAGE_MAX_SIZE_BYTES } from '@lumos/validation/campaign';
import { AVATAR_MAX_SIZE_BYTES } from '@lumos/validation/user';
import imageCompression from 'browser-image-compression';

export async function prepareAvatar(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: AVATAR_MAX_SIZE_BYTES / 1024 / 1024,
    maxWidthOrHeight: 1024,
    fileType: 'image/webp',
    initialQuality: 0.8,
    useWebWorker: true,
  });
}

export async function prepareCampaignImage(file: File, signal?: AbortSignal): Promise<File> {
  const compressed = await imageCompression(file, {
    maxSizeMB: CAMPAIGN_IMAGE_MAX_SIZE_BYTES / 1024 / 1024,
    maxWidthOrHeight: 1920,
    fileType: 'image/webp',
    initialQuality: 0.82,
    useWebWorker: true,
    signal,
  });
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'campanha';
  return new File([compressed], `${baseName}.webp`, { type: 'image/webp' });
}
