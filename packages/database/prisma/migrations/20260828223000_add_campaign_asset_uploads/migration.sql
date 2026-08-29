-- Extend upload intents to campaign-owned assets.
ALTER TYPE "UploadIntentPurpose" ADD VALUE 'CAMPAIGN_IMAGE';
ALTER TYPE "UploadIntentPurpose" ADD VALUE 'ACCOUNTABILITY_EVIDENCE';

ALTER TABLE "upload_intents"
ADD COLUMN "originalFileName" TEXT,
ADD COLUMN "targetCampaignId" TEXT;

ALTER TABLE "upload_intents"
DROP CONSTRAINT "upload_intents_activeSlot_check";

ALTER TABLE "upload_intents"
ADD CONSTRAINT "upload_intents_activeSlot_check"
CHECK ("activeSlot" IS NULL OR "activeSlot" BETWEEN 1 AND 10);

CREATE INDEX "upload_intents_targetCampaignId_purpose_status_idx"
ON "upload_intents"("targetCampaignId", "purpose", "status");

ALTER TABLE "upload_intents"
ADD CONSTRAINT "upload_intents_targetCampaignId_fkey"
FOREIGN KEY ("targetCampaignId") REFERENCES "campaigns"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TYPE "CampaignAssetKind" AS ENUM ('IMAGE', 'ACCOUNTABILITY_EVIDENCE');

CREATE TABLE "campaign_assets" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "accountabilityId" TEXT,
  "uploaderId" TEXT NOT NULL,
  "kind" "CampaignAssetKind" NOT NULL,
  "objectKey" TEXT NOT NULL,
  "originalFileName" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "contentLength" INTEGER NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  "removedAt" TIMESTAMP(3),
  "cleanupPending" BOOLEAN NOT NULL DEFAULT false,
  "cleanupToken" TEXT,
  "cleanupStartedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "campaign_assets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "campaign_assets_objectKey_key" ON "campaign_assets"("objectKey");
CREATE INDEX "campaign_assets_campaignId_kind_removedAt_position_idx"
ON "campaign_assets"("campaignId", "kind", "removedAt", "position");
CREATE INDEX "campaign_assets_accountabilityId_removedAt_position_idx"
ON "campaign_assets"("accountabilityId", "removedAt", "position");
CREATE INDEX "campaign_assets_uploaderId_cleanupPending_cleanupStartedAt_idx"
ON "campaign_assets"("uploaderId", "cleanupPending", "cleanupStartedAt");

-- A campaign may expose only one active managed image.
CREATE UNIQUE INDEX "campaign_assets_one_active_image_per_campaign"
ON "campaign_assets"("campaignId")
WHERE "kind" = 'IMAGE' AND "removedAt" IS NULL;

ALTER TABLE "campaign_assets"
ADD CONSTRAINT "campaign_assets_campaignId_fkey"
FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaign_assets"
ADD CONSTRAINT "campaign_assets_accountabilityId_fkey"
FOREIGN KEY ("accountabilityId") REFERENCES "campaign_accountabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "campaign_assets"
ADD CONSTRAINT "campaign_assets_uploaderId_fkey"
FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "campaign_assets"
ADD CONSTRAINT "campaign_assets_kind_parent_check"
CHECK (
  ("kind" = 'IMAGE' AND "accountabilityId" IS NULL)
  OR ("kind" = 'ACCOUNTABILITY_EVIDENCE' AND "accountabilityId" IS NOT NULL)
);

ALTER TABLE "campaigns" DROP COLUMN "imageUrl";
ALTER TABLE "campaign_accountabilities" DROP COLUMN "evidenceUrls";
