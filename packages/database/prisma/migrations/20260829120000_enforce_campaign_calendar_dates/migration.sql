BEGIN;

-- Campaign dates represent São Paulo calendar days, not instants. Existing
-- rows were written at UTC midnight by the API; truncate legacy values before
-- applying the native DATE type.
ALTER TABLE "campaigns"
  ALTER COLUMN "startDate" TYPE DATE USING "startDate"::date,
  ALTER COLUMN "endDate" TYPE DATE USING "endDate"::date;

-- Reconcile legacy rows while the old status values are still available. The
-- automatic completion timestamp is stored as a UTC timestamp because the
-- lifecycle columns intentionally use timestamp without time zone.
UPDATE "campaigns"
SET
  "status" = 'COMPLETED',
  "updatedAt" = clock_timestamp(),
  "completedAt" = ((("endDate" + INTERVAL '1 day')::timestamp AT TIME ZONE 'America/Sao_Paulo') AT TIME ZONE 'UTC')
WHERE "status" IN ('PENDING', 'ACTIVE')
  AND "endDate" < (timezone('America/Sao_Paulo', clock_timestamp()))::date;

UPDATE "campaigns"
SET "status" = 'PENDING',
    "updatedAt" = clock_timestamp()
WHERE "status" = 'ACTIVE'
  AND "startDate" > (timezone('America/Sao_Paulo', clock_timestamp()))::date;

UPDATE "campaigns"
SET "status" = 'ACTIVE',
    "updatedAt" = clock_timestamp()
WHERE "status" = 'PENDING'
  AND "startDate" <= (timezone('America/Sao_Paulo', clock_timestamp()))::date
  AND "endDate" >= (timezone('America/Sao_Paulo', clock_timestamp()))::date;

CREATE INDEX "campaigns_status_endDate_idx" ON "campaigns"("status", "endDate");

COMMIT;
