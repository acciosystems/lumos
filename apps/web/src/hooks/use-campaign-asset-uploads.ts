import {
  CAMPAIGN_EVIDENCE_CONTENT_TYPES,
  CAMPAIGN_EVIDENCE_MAX_COUNT,
  CAMPAIGN_EVIDENCE_MAX_SIZE_BYTES,
} from '@lumos/validation/campaign';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { rpc } from '@/lib/rpc';
import { prepareCampaignImage } from '@/utils/image';
import { uploadFileWithProgress } from '@/utils/upload';

export type StagedCampaignAsset = {
  key: string;
  sourceFile: File;
  file: File;
  previewUrl: string | null;
  uploadId: string | null;
  progress: number;
  status: 'preparing' | 'uploading' | 'verifying' | 'ready' | 'error';
  error: string | null;
};

export function useCampaignAssetUploads({
  kind,
  campaignId,
  maxCount = kind === 'IMAGE' ? 1 : CAMPAIGN_EVIDENCE_MAX_COUNT,
}: {
  kind: 'IMAGE' | 'ACCOUNTABILITY_EVIDENCE';
  campaignId?: string;
  maxCount?: number;
}) {
  const [assets, setAssets] = useState<StagedCampaignAsset[]>([]);
  const assetsRef = useRef(assets);
  const controllers = useRef(new Map<string, AbortController>());
  assetsRef.current = assets;

  useEffect(
    () => () => {
      for (const controller of controllers.current.values()) controller.abort();
      for (const asset of assetsRef.current) {
        if (asset.previewUrl) URL.revokeObjectURL(asset.previewUrl);
      }
    },
    [],
  );

  const updateAsset = (key: string, patch: Partial<StagedCampaignAsset>) => {
    setAssets((current) =>
      current.map((asset) => (asset.key === key ? { ...asset, ...patch } : asset)),
    );
  };

  const startUpload = async (key: string, sourceFile: File) => {
    const controller = new AbortController();
    controllers.current.set(key, controller);
    let uploadId: string | null = null;
    try {
      const file =
        kind === 'IMAGE' ? await prepareCampaignImage(sourceFile, controller.signal) : sourceFile;
      controller.signal.throwIfAborted();
      updateAsset(key, { file, status: 'uploading', progress: 0, error: null });
      const intent =
        kind === 'IMAGE'
          ? await rpc.campaign.assetUpload.createIntent.call({
              kind,
              originalFileName: file.name,
              contentType: 'image/webp',
              contentLength: file.size,
            })
          : await rpc.campaign.assetUpload.createIntent.call({
              kind,
              campaignId: requireCampaignId(campaignId),
              originalFileName: file.name,
              contentType: file.type as (typeof CAMPAIGN_EVIDENCE_CONTENT_TYPES)[number],
              contentLength: file.size,
            });
      uploadId = intent.uploadId;
      controller.signal.throwIfAborted();
      updateAsset(key, { uploadId });

      try {
        await uploadFileWithProgress({
          signedUrl: intent.signedUrl,
          file,
          signal: controller.signal,
          onProgress: (progress) => updateAsset(key, { progress }),
        });
      } catch (uploadError) {
        if (controller.signal.aborted) throw uploadError;
        // A lost success response is indistinguishable from a failed PUT in the browser.
        // The authoritative HEAD below reconciles that ambiguity.
      }

      updateAsset(key, { status: 'verifying', progress: 100 });
      await rpc.campaign.assetUpload.verify.call({ uploadId });
      updateAsset(key, { status: 'ready', progress: 100 });
    } catch (error) {
      if (controller.signal.aborted) {
        if (uploadId) {
          try {
            await rpc.campaign.assetUpload.discard.call({ uploadId });
          } catch {
            // Expiration and the storage lifecycle remain the fallback.
          }
        }
        return;
      }
      updateAsset(key, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Não foi possível enviar o arquivo.',
        uploadId,
      });
    } finally {
      controllers.current.delete(key);
    }
  };

  const addFiles = (files: File[]) => {
    const available = kind === 'IMAGE' ? 1 : Math.max(0, maxCount - assetsRef.current.length);
    const validFiles = files.filter((file) => {
      if (kind === 'IMAGE') {
        if (!file.type.startsWith('image/') || ['image/heic', 'image/heif'].includes(file.type)) {
          toast.error('Selecione uma imagem JPEG, PNG ou WebP.');
          return false;
        }
        return true;
      }
      if (
        !CAMPAIGN_EVIDENCE_CONTENT_TYPES.includes(
          file.type as (typeof CAMPAIGN_EVIDENCE_CONTENT_TYPES)[number],
        )
      ) {
        toast.error(`${file.name}: envie uma imagem JPEG, PNG ou WebP, ou um PDF.`);
        return false;
      }
      if (file.size > CAMPAIGN_EVIDENCE_MAX_SIZE_BYTES) {
        toast.error(`${file.name}: o arquivo deve ter no máximo 10 MB.`);
        return false;
      }
      return true;
    });
    const accepted = validFiles.slice(0, available);
    if (validFiles.length > available)
      toast.error(`Você pode adicionar no máximo ${maxCount} arquivo(s).`);

    const drafts = accepted.map((file) => ({
      key: crypto.randomUUID(),
      sourceFile: file,
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      uploadId: null,
      progress: 0,
      status: 'preparing' as const,
      error: null,
    }));
    if (kind === 'IMAGE' && !drafts.length) return;
    if (kind === 'IMAGE' && assetsRef.current[0]) void removeAsset(assetsRef.current[0].key);
    setAssets((current) => (kind === 'IMAGE' ? drafts.slice(0, 1) : [...current, ...drafts]));
    for (const draft of drafts) void startUpload(draft.key, draft.file);
  };

  const removeAsset = async (key: string, discard = true) => {
    const asset = assetsRef.current.find((candidate) => candidate.key === key);
    if (!asset) return;
    controllers.current.get(key)?.abort();
    if (asset.previewUrl) URL.revokeObjectURL(asset.previewUrl);
    setAssets((current) => current.filter((candidate) => candidate.key !== key));
    if (discard && asset.uploadId) {
      try {
        await rpc.campaign.assetUpload.discard.call({ uploadId: asset.uploadId });
      } catch {
        // The server lifecycle policy remains the fallback for abandoned staging objects.
      }
    }
  };

  const retryAsset = async (key: string) => {
    const asset = assetsRef.current.find((candidate) => candidate.key === key);
    if (!asset) return;
    if (asset.uploadId) {
      try {
        await rpc.campaign.assetUpload.discard.call({ uploadId: asset.uploadId });
      } catch {
        // A terminal or expired intent is safe to replace with a fresh one.
      }
    }
    updateAsset(key, { uploadId: null, status: 'preparing', progress: 0, error: null });
    await startUpload(key, asset.sourceFile);
  };

  const releaseAssets = () => {
    for (const asset of assetsRef.current) {
      if (asset.previewUrl) URL.revokeObjectURL(asset.previewUrl);
    }
    setAssets([]);
  };

  const markReadyAssetsFailed = (message: string) => {
    setAssets((current) =>
      current.map((asset) =>
        asset.status === 'ready' ? { ...asset, status: 'error', error: message } : asset,
      ),
    );
  };

  return {
    assets,
    addFiles,
    removeAsset,
    retryAsset,
    releaseAssets,
    markReadyAssetsFailed,
    readyUploadIds: assets.flatMap((asset) =>
      asset.status === 'ready' && asset.uploadId ? [asset.uploadId] : [],
    ),
    isBusy: assets.some((asset) => asset.status !== 'ready' && asset.status !== 'error'),
    hasErrors: assets.some((asset) => asset.status === 'error'),
  };
}

function requireCampaignId(campaignId: string | undefined) {
  if (!campaignId) throw new Error('A campanha é obrigatória para enviar evidências.');
  return campaignId;
}
