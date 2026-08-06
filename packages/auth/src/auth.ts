import { passkey } from '@better-auth/passkey';
import { prisma } from '@lumos/database';
import { sendEmail } from '@lumos/email';
import { env } from '@lumos/env/auth';
import { betterAuth } from 'better-auth';
import { localization } from 'better-auth-localization';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { haveIBeenPwned, lastLoginMethod, username } from 'better-auth/plugins';
import { ulid } from 'ulid';

import { addGeneratedUsernameBeforeCreate, usernamePluginOptions } from './username';

// WARN: don't await the email sending to prevent timing attacks

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
    sendResetPassword: async ({ user, url }) => {
      sendEmail({
        to: user.email,
        subject: 'Redefinição de senha',
        body: `Clique no link para redefinir sua senha: ${url}`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      sendEmail({
        to: user.email,
        subject: 'Verificação de email',
        body: `Clique no link para verificar seu email: ${url}`,
      });
    },
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
