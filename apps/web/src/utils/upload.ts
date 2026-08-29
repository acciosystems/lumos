export async function reconcileSingleWriteUpload(
  upload: () => Promise<unknown>,
  confirm: () => Promise<unknown>,
) {
  let uploadError: unknown;
  try {
    await upload();
  } catch (error) {
    uploadError = error;
  }

  try {
    // Confirmation performs the authoritative storage check. A successful
    // confirmation reconciles a browser response that was lost after upload.
    await confirm();
  } catch (confirmationError) {
    throw uploadError ?? confirmationError;
  }
}

export function uploadFileWithProgress({
  signedUrl,
  file,
  signal,
  onProgress,
}: {
  signedUrl: string;
  file: File;
  signal?: AbortSignal;
  onProgress: (percentage: number) => void;
}) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException('Upload cancelado.', 'AbortError'));
      return;
    }

    const request = new XMLHttpRequest();
    request.open('PUT', signedUrl);
    request.setRequestHeader('Content-Type', file.type);
    request.setRequestHeader('If-None-Match', '*');
    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error(`O armazenamento recusou o arquivo (HTTP ${request.status}).`));
    });
    request.addEventListener('error', () =>
      reject(new Error('A conexão com o armazenamento falhou.')),
    );
    request.addEventListener('abort', () =>
      reject(new DOMException('Upload cancelado.', 'AbortError')),
    );
    signal?.addEventListener('abort', () => request.abort(), { once: true });
    request.send(file);
  });
}
