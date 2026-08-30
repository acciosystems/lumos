CREATE TYPE "CampaignOperationKind" AS ENUM ('CREATE', 'PUBLISH_UPDATE');

CREATE TABLE "campaign_idempotency_records" (
    "id" TEXT NOT NULL,
    "operationKey" TEXT NOT NULL,
    "requestFingerprint" TEXT NOT NULL,
    "kind" "CampaignOperationKind" NOT NULL,
    "actorId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_idempotency_records_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "campaign_idempotency_records_operationKey_key"
ON "campaign_idempotency_records"("operationKey");

CREATE INDEX "campaign_idempotency_records_expiresAt_idx"
ON "campaign_idempotency_records"("expiresAt");

CREATE INDEX "campaign_idempotency_records_actorId_kind_idx"
ON "campaign_idempotency_records"("actorId", "kind");

ALTER TABLE "campaign_idempotency_records"
ADD CONSTRAINT "campaign_idempotency_records_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
