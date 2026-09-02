import { UploadIntentStatus } from '@lumos/database/generated/prisma/client';
import { ORPCError } from '@orpc/client';

type TerminalUploadIntentStatus =
  | typeof UploadIntentStatus.REJECTED
  | typeof UploadIntentStatus.EXPIRED;

export function isLeaseStale(startedAt: Date | null, now: Date, leaseMs: number) {
  return !startedAt || startedAt.getTime() <= now.getTime() - leaseMs;
}

export function terminalUploadIntentData(
  status: TerminalUploadIntentStatus,
  failureReason: string,
) {
  return {
    status,
    activeSlot: null,
    processingToken: null,
    processingStartedAt: null,
    failureReason,
    cleanupPending: true,
  };
}

export function throwUploadRateLimit(): never {
  throw new ORPCError('TOO_MANY_REQUESTS', {
    message: 'Muitas tentativas de upload. Aguarde alguns minutos e tente novamente.',
  });
}
