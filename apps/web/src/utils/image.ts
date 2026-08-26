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
