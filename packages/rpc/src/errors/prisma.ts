import { Prisma } from '@lumos/database/generated/prisma/client';
import { ORPCError } from '@orpc/client';

type UniqueConstraintConflict = {
  target: readonly string[];
  message: string;
};

function hasSameFields(actual: readonly string[], expected: readonly string[]) {
  return actual.length === expected.length && expected.every((field) => actual.includes(field));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getStringArray(value: unknown) {
  return Array.isArray(value) && value.every((field) => typeof field === 'string') ? value : null;
}

function getUniqueConstraintTarget(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
    return null;
  }

  const target = getStringArray(error.meta?.target);
  if (target) return target;

  const driverAdapterError = error.meta?.driverAdapterError;
  if (!isRecord(driverAdapterError) || !isRecord(driverAdapterError.cause)) return null;

  const adapterCause = driverAdapterError.cause;
  if (adapterCause.kind !== 'UniqueConstraintViolation' || !isRecord(adapterCause.constraint)) {
    return null;
  }

  return getStringArray(adapterCause.constraint.fields);
}

export async function withUniqueConstraintConflicts<Result>(
  operation: () => Promise<Result>,
  conflicts: readonly UniqueConstraintConflict[],
) {
  try {
    return await operation();
  } catch (error) {
    const target = getUniqueConstraintTarget(error);
    const conflict = target
      ? conflicts.find((candidate) => hasSameFields(target, candidate.target))
      : undefined;

    if (!conflict) throw error;

    throw new ORPCError('CONFLICT', {
      message: conflict.message,
      cause: error,
    });
  }
}
