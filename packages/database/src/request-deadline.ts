import { AsyncLocalStorage } from 'node:async_hooks';

type DatabaseRequestGuard = () => void;

const databaseRequestGuard = new AsyncLocalStorage<DatabaseRequestGuard>();

/** Runs work with a request-local check performed before each database operation. */
export function withDatabaseRequestGuard<T>(guard: DatabaseRequestGuard, callback: () => T): T {
  return databaseRequestGuard.run(guard, callback);
}

/** Prevents a database operation from starting once its enclosing request has expired. */
export function assertDatabaseRequestAllowed(): void {
  databaseRequestGuard.getStore()?.();
}
