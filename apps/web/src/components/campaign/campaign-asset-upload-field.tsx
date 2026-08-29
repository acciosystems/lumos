import { IconFile, IconPhoto, IconRefresh, IconTrash, IconUpload } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Progress, ProgressLabel } from '@/components/ui/progress';
import type { StagedCampaignAsset } from '@/hooks/use-campaign-asset-uploads';
import { formatFileSize } from '@/utils/file-size';

export function CampaignAssetUploadField({
  id,
  label,
  description,
  kind,
  assets,
  disabled,
  maxCount,
  onFiles,
  onRemove,
  onRetry,
}: {
  id: string;
  label: string;
  description: string;
  kind: 'IMAGE' | 'ACCOUNTABILITY_EVIDENCE';
  assets: StagedCampaignAsset[];
  disabled?: boolean;
  maxCount: number;
  onFiles: (files: File[]) => void;
  onRemove: (key: string) => void;
  onRetry: (key: string) => void;
}) {
  const isImage = kind === 'IMAGE';
  const canAdd = !disabled && (isImage || assets.length < maxCount);

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex flex-col gap-3">
        <Input
          id={id}
          type="file"
          accept={
            isImage
              ? 'image/jpeg,image/png,image/webp'
              : 'image/jpeg,image/png,image/webp,application/pdf'
          }
          multiple={!isImage}
          disabled={!canAdd}
          onChange={(event) => {
            onFiles(Array.from(event.target.files ?? []));
            event.target.value = '';
          }}
        />
        {assets.length ? (
          <ItemGroup aria-live="polite">
            {assets.map((asset) => (
              <Item key={asset.key} variant="outline" size="sm">
                <ItemMedia variant={asset.previewUrl ? 'image' : 'icon'}>
                  {asset.previewUrl ? (
                    <img src={asset.previewUrl} alt="" />
                  ) : asset.file.type === 'application/pdf' ? (
                    <IconFile />
                  ) : (
                    <IconPhoto />
                  )}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{asset.file.name}</ItemTitle>
                  <ItemDescription>
                    {formatFileSize(asset.file.size)} · {statusLabel(asset)}
                  </ItemDescription>
                  {asset.status !== 'ready' && asset.status !== 'error' ? (
                    <Progress value={asset.progress} className="mt-1 gap-2">
                      <ProgressLabel className="sr-only">
                        Progresso de {asset.file.name}
                      </ProgressLabel>
                      <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                        {asset.progress}%
                      </span>
                    </Progress>
                  ) : null}
                  {asset.error ? <p className="text-xs text-destructive">{asset.error}</p> : null}
                </ItemContent>
                <ItemActions>
                  {asset.status === 'error' ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label={`Tentar enviar ${asset.file.name} novamente`}
                      disabled={disabled}
                      onClick={() => onRetry(asset.key)}
                    >
                      <IconRefresh />
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label={`Remover ${asset.file.name}`}
                    disabled={disabled}
                    onClick={() => onRemove(asset.key)}
                  >
                    <IconTrash />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        ) : (
          <div className="flex items-center gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground">
            <IconUpload className="size-4" />
            {isImage ? 'Nenhuma imagem selecionada.' : 'Nenhuma evidência nova selecionada.'}
          </div>
        )}
      </div>
      <FieldDescription>{description}</FieldDescription>
    </Field>
  );
}

function statusLabel(asset: StagedCampaignAsset) {
  const labels = {
    preparing: 'Preparando arquivo',
    uploading: 'Enviando',
    verifying: 'Verificando no servidor',
    ready: 'Pronto para salvar',
    error: 'Falha no envio',
  };
  return labels[asset.status];
}
