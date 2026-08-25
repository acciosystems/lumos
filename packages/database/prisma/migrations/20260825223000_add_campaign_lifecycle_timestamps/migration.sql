-- Preserve a terminal lifecycle timestamp independently from mutable campaign fields.
ALTER TABLE "campaigns"
ADD COLUMN "completedAt" TIMESTAMP(3),
ADD COLUMN "cancelledAt" TIMESTAMP(3);

-- Existing terminal campaigns predate dedicated lifecycle timestamps. `updatedAt` is the
-- closest available historical value and remains immutable for these migrated records.
UPDATE "campaigns"
SET "completedAt" = "updatedAt"
WHERE "status" = 'COMPLETED' AND "completedAt" IS NULL;

UPDATE "campaigns"
SET "cancelledAt" = "updatedAt"
WHERE "status" = 'CANCELLED' AND "cancelledAt" IS NULL;
