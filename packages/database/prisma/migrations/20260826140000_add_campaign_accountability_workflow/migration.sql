BEGIN;

ALTER TABLE "campaign_accountabilities"
  RENAME COLUMN "notes" TO "outcomeSummary";

ALTER TABLE "campaign_accountabilities"
  RENAME COLUMN "evidencesUrls" TO "evidenceUrls";

-- Existing reports were physical-only. Keep their values while allowing the
-- type-specific virtual total to be added.
ALTER TABLE "campaign_accountabilities"
  ALTER COLUMN "totalItems" DROP NOT NULL,
  ADD COLUMN "totalAmountCents" INTEGER;

-- The old schema permitted an absent narrative. Give legacy rows a truthful
-- migration marker before enforcing the new required field for all reports.
UPDATE "campaign_accountabilities"
SET "outcomeSummary" = 'Relatório migrado sem resumo informado.'
WHERE NULLIF(BTRIM("outcomeSummary"), '') IS NULL;

UPDATE "campaign_accountabilities"
SET "evidenceUrls" = ARRAY[]::TEXT[]
WHERE "evidenceUrls" IS NULL;

ALTER TABLE "campaign_accountabilities"
  ALTER COLUMN "outcomeSummary" SET NOT NULL,
  ALTER COLUMN "evidenceUrls" SET NOT NULL;

ALTER TABLE "campaign_accountabilities"
  DROP CONSTRAINT IF EXISTS "campaign_accountabilities_total_items_nonnegative_check",
  ADD CONSTRAINT "campaign_accountabilities_result_check"
    CHECK (
      ("totalItems" IS NOT NULL AND "totalItems" >= 0 AND "totalAmountCents" IS NULL)
      OR
      ("totalItems" IS NULL AND "totalAmountCents" IS NOT NULL AND "totalAmountCents" >= 0)
    ),
  ADD CONSTRAINT "campaign_accountabilities_summary_check"
    CHECK (NULLIF(BTRIM("outcomeSummary"), '') IS NOT NULL);

COMMENT ON CONSTRAINT "campaign_accountabilities_result_check" ON "campaign_accountabilities"
  IS 'Accountability reports contain exactly one nonnegative type-specific total.';
COMMENT ON CONSTRAINT "campaign_accountabilities_summary_check" ON "campaign_accountabilities"
  IS 'Accountability reports require a nonblank public outcome summary.';

COMMIT;
