import { AVATAR_MAX_SIZE_BYTES, imageSchema } from '@lumos/validation/user';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import ky from 'ky';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useStrictAuth } from '@/lib/auth/hooks';
import { rpc } from '@/lib/rpc';

const formSchema = v.object({
  image: imageSchema,
});

export function UserAvatarChange() {
  const { refreshSession, user } = useStrictAuth();

  const [isOpen, setOpen] = useState(false);

  const changeMutation = useMutation({
    mutationFn: async (file: File) => {
      const image = await imageCompression(file, {
        maxSizeMB: AVATAR_MAX_SIZE_BYTES / 1024 / 1024,
        maxWidthOrHeight: 1024,
        fileType: 'image/webp',
        initialQuality: 0.8,
        useWebWorker: true,
      });

      const { signedUrl, uploadId } = await rpc.user.avatar.getUploadUrl.call({
        contentType: image.type,
        contentLength: image.size,
      });

      let uploadError: unknown;
      try {
        await ky.put(signedUrl, {
          body: image,
          headers: {
            'Content-Type': image.type,
            'If-None-Match': '*',
          },
          // This URL is single-write. A retry after a lost success response
          // would receive 412 even though R2 already stored the object.
          retry: 0,
        });
      } catch (error) {
        uploadError = error;
      }

      try {
        // Confirmation performs the authoritative storage check and reconciles
        // a browser response that was lost after a successful upload.
        await rpc.user.avatar.confirmUpload.call({ uploadId });
      } catch (confirmationError) {
        throw uploadError ?? confirmationError;
      }
    },
    onSuccess: async () => {
      await refreshSession();
      toast.success('Foto de perfil atualizada com sucesso');
      setOpen(false);
      form.reset();
    },
    onError: (error) =>
      toast.error('Falha ao atualizar a foto de perfil', {
        description: error.message,
      }),
  });

  const deleteMutation = useMutation(
    rpc.user.avatar.delete.mutationOptions({
      onSuccess: async () => {
        await refreshSession();
        toast.success('Foto de perfil excluída com sucesso');
        setOpen(false);
      },
      onError: (error) =>
        toast.error('Falha ao excluir a foto de perfil', {
          description: error.message,
        }),
    }),
  );

  const isPending = changeMutation.isPending || deleteMutation.isPending;

  const form = useForm({
    defaultValues: {
      image: undefined as File | undefined,
    },
    validators: {
      onSubmit: formSchema,
    },
    // oxlint-disable-next-line typescript/no-non-null-assertion
    onSubmit: ({ value }) => changeMutation.mutate(value.image!),
  });

  const formId = useId();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (changeMutation.isPending) return;
          else form.reset();
        }
        setOpen(open);
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
        <Avatar size="lg" className="hover:opacity-75">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar foto de perfil</DialogTitle>
        </DialogHeader>

        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="image">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Selecione uma imagem</FieldLabel>
                  <Input
                    id={field.name}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) field.handleChange(file);
                    }}
                    aria-invalid={isInvalid}
                  />
                  <FieldDescription>
                    A imagem deve ter no máximo 1MB. Imagens quadradas são recomendadas
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </form>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {user.image ? (
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate()}
                disabled={isPending}
              >
                {deleteMutation.isPending && <Spinner />}
                Excluir
              </Button>
            ) : (
              // So it doesn't break the justify-between layout
              <span></span>
            )}
            <form.Subscribe
              selector={(state) => ({
                isDefaultValue: state.isDefaultValue,
                isValid: state.isValid,
              })}
            >
              {({ isDefaultValue, isValid }) => (
                <Button
                  type="submit"
                  form={formId}
                  disabled={isDefaultValue || !isValid || isPending}
                >
                  {changeMutation.isPending && <Spinner />}
                  Salvar
                </Button>
              )}
            </form.Subscribe>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
