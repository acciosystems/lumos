-- CreateEnum
CREATE TYPE "UploadIntentPurpose" AS ENUM ('USER_AVATAR');

-- CreateEnum
CREATE TYPE "UploadIntentStatus" AS ENUM ('PENDING', 'PROCESSING', 'CONFIRMED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "upload_intents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "purpose" "UploadIntentPurpose" NOT NULL,
    "status" "UploadIntentStatus" NOT NULL DEFAULT 'PENDING',
    "stagingKey" TEXT NOT NULL,
    "publishedKey" TEXT,
    "previousKey" TEXT,
    "contentType" TEXT NOT NULL,
    "contentLength" INTEGER NOT NULL,
    "maxSize" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "cleanupPending" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "upload_intents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "upload_intents_stagingKey_key" ON "upload_intents"("stagingKey");

-- CreateIndex
CREATE UNIQUE INDEX "upload_intents_publishedKey_key" ON "upload_intents"("publishedKey");

-- CreateIndex
CREATE INDEX "upload_intents_userId_purpose_status_idx" ON "upload_intents"("userId", "purpose", "status");

-- CreateIndex
CREATE INDEX "upload_intents_status_expiresAt_idx" ON "upload_intents"("status", "expiresAt");

-- AddForeignKey
ALTER TABLE "upload_intents" ADD CONSTRAINT "upload_intents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
