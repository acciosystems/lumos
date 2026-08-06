import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { prisma } from '@lumos/database';
import { env } from '@lumos/env/rpc';
import { ulid } from 'ulid';
import * as v from 'valibot';

import { authorized } from '../procedures';
import { s3Client } from '../services/s3';

export const userRouter = {
  avatar: {
    getUploadUrl: authorized.handler(async ({ context: { user, log } }) => {
      const filename = `avatars/${user.id}.webp`;

      const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: filename,
        ContentType: 'image/webp',
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 5 * 60, // 5 minutes
      });

      const eventId = ulid();
      log.set({ eventId });

      return { signedUrl, eventId };
    }),

    confirmUpload: authorized
      .input(v.object({ eventId: v.pipe(v.string(), v.ulid()) }))
      .handler(async ({ input, context: { user, log } }) => {
        log.set({ eventId: input.eventId });

        const fileName = `avatars/${user.id}.webp`;
        const fileUrl = `${env.S3_PUBLIC_URL}/${fileName}`;

        await prisma.user.update({
          where: { id: user.id },
          data: { image: fileUrl },
        });
      }),

    delete: authorized.handler(async ({ context: { user } }) => {
      const fileName = `avatars/${user.id}.webp`;

      const command = new DeleteObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: fileName,
      });

      await s3Client.send(command);

      await prisma.user.update({
        where: { id: user.id },
        data: { image: null },
      });
    }),
  },
};
