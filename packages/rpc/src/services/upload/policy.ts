export function isLeaseStale(startedAt: Date | null, now: Date, leaseMs: number) {
  return !startedAt || startedAt.getTime() <= now.getTime() - leaseMs;
}
