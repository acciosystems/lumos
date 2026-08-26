import { avatarUploadInputSchema } from '@lumos/validation/user';
import * as v from 'valibot';

import { authorized } from '../procedures';
import { confirmAvatarUpload, createAvatarUploadIntent, deleteAvatar } from '../services/avatar';

export const userRouter = {
  avatar: {
    getUploadUrl: authorized
      .input(avatarUploadInputSchema)
      .handler(async ({ input, context: { user, log } }) =>
        createAvatarUploadIntent({
          userId: user.id,
          contentType: input.contentType,
          contentLength: input.contentLength,
          log,
        }),
      ),

    confirmUpload: authorized
      .input(v.object({ uploadId: v.pipe(v.string(), v.ulid()) }))
      .handler(async ({ input, context: { user, log } }) =>
        confirmAvatarUpload({ uploadId: input.uploadId, userId: user.id, log }),
      ),

    delete: authorized.handler(async ({ context: { user, log } }) =>
      deleteAvatar({ userId: user.id, log }),
    ),
  },
};
