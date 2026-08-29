DROP INDEX "campaign_assets_cleanupPending_cleanupStartedAt_idx";
DROP INDEX "campaign_assets_uploaderId_cleanupPending_cleanupStartedAt_idx";

ALTER TABLE "campaign_assets"
DROP COLUMN "cleanupPending",
DROP COLUMN "cleanupToken",
DROP COLUMN "cleanupStartedAt";

CREATE INDEX "campaign_assets_uploaderId_removedAt_idx"
ON "campaign_assets"("uploaderId", "removedAt");
