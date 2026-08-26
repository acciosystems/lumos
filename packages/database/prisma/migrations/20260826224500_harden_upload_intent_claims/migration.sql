-- AlterTable
ALTER TABLE "upload_intents"
ADD COLUMN "activeSlot" INTEGER,
ADD COLUMN "processingToken" TEXT,
ADD COLUMN "processingStartedAt" TIMESTAMP(3),
ADD COLUMN "cleanupToken" TEXT,
ADD COLUMN "cleanupStartedAt" TIMESTAMP(3);

-- Active slots bound concurrently-created avatar upload intents per user.
ALTER TABLE "upload_intents"
ADD CONSTRAINT "upload_intents_activeSlot_check"
CHECK ("activeSlot" IS NULL OR "activeSlot" BETWEEN 1 AND 3);

-- CreateIndex
CREATE UNIQUE INDEX "upload_intents_userId_purpose_activeSlot_key"
ON "upload_intents"("userId", "purpose", "activeSlot");

-- CreateIndex
CREATE INDEX "upload_intents_cleanupPending_cleanupStartedAt_idx"
ON "upload_intents"("cleanupPending", "cleanupStartedAt");
