import imageCompression from 'browser-image-compression';

export async function prepareAvatar(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    fileType: 'image/webp',
    initialQuality: 0.8,
    useWebWorker: true,
  });
}
