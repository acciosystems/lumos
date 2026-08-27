import { usernameSchema } from '@lumos/validation/user';
import { ulid } from 'ulid';
import * as v from 'valibot';

const USERNAME_PREFIX_FALLBACK = 'usr';

export const usernamePluginOptions = {
  minUsernameLength: 3,
  maxUsernameLength: 30,
  usernameValidator: (username: string) => /^[a-zA-Z0-9_]+$/.test(username),
} as const;

export function generateUsername(name: string, id: string): string {
  const prefix = name
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 3);

  return `${prefix || USERNAME_PREFIX_FALLBACK}_${id.toLowerCase()}`;
}

type UserCreatePayload = {
  name: string;
  username?: unknown;
} & Record<string, unknown>;

export async function addGeneratedUsernameBeforeCreate(user: UserCreatePayload) {
  if (typeof user.username === 'string') return { data: user };

  const id = ulid();
  const username = v.parse(usernameSchema, generateUsername(user.name, id));

  return {
    data: {
      ...user,
      id,
      username,
      displayUsername: username,
    },
  };
}
