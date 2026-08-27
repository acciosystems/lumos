import { passkey } from '@better-auth/passkey';
import { prisma } from '@lumos/database';
import { env } from '@lumos/env/auth';
import { betterAuth } from 'better-auth';
import { localization } from 'better-auth-localization';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { haveIBeenPwned, lastLoginMethod, username } from 'better-auth/plugins';
import { ulid } from 'ulid';

import {
  AUTH_EMAIL_EXPIRES_IN_SECONDS,
  emailIdempotencyKey,
  sendAuthEmail,
} from './utils/auth-email';
import { addGeneratedUsernameBeforeCreate, usernamePluginOptions } from './utils/username';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  databaseHooks: {
    user: {
      create: {
        before: addGeneratedUsernameBeforeCreate,
      },
    },
  },
  experimental: { joins: true },
  emailAndPassword: {
    enabled: true,
    disableSignUp: !env.SIGNUP_ENABLED,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: AUTH_EMAIL_EXPIRES_IN_SECONDS,
    sendResetPassword: async ({ user, url, token }) =>
      await sendAuthEmail({
        to: user.email,
        subject: 'Redefinição de senha',
        body: `Clique no link para redefinir sua senha: ${url}`,
        kind: 'password_reset',
        idempotencyKey: emailIdempotencyKey('password-reset', token),
      }),
  },
  emailVerification: {
    expiresIn: AUTH_EMAIL_EXPIRES_IN_SECONDS,
    sendVerificationEmail: async ({ user, url, token }) =>
      await sendAuthEmail({
        to: user.email,
        subject: 'Verificação de email',
        body: `Clique no link para verificar seu email: ${url}`,
        kind: 'email_verification',
        idempotencyKey: emailIdempotencyKey('email-verification', token),
      }),
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    // TODO: allow user deletion (gonna take a long while to implement)
  },
  account: {
    accountLinking: {
      allowDifferentEmails: true,
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    database: {
      generateId: () => ulid(),
    },
  },
  plugins: [
    username(usernamePluginOptions),
    passkey({
      registration: {
        requireSession: true,
      },
    }),
    haveIBeenPwned(),
    localization({
      defaultLocale: 'pt-BR',
      fallbackLocale: 'default',
    }),
    lastLoginMethod({
      customResolveMethod: (ctx) => {
        if (ctx.path === '/sign-in/username') return 'username';
        if (ctx.path.startsWith('/sign-in/passkey')) return 'passkey';

        // fallback to default resolver
        return null;
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
