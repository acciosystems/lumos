-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('PHYSICAL', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrganizerType" AS ENUM ('INDIVIDUAL', 'ORGANIZATION');

-- AlterTable
ALTER TABLE "user" RENAME TO "users";
ALTER TABLE "session" RENAME TO "sessions";
ALTER TABLE "account" RENAME TO "accounts";
ALTER TABLE "verification" RENAME TO "verifications";
ALTER TABLE "passkey" RENAME TO "passkeys";

-- AlterIndex
ALTER INDEX "user_pkey" RENAME TO "users_pkey";
ALTER INDEX "session_pkey" RENAME TO "sessions_pkey";
ALTER INDEX "account_pkey" RENAME TO "accounts_pkey";
ALTER INDEX "verification_pkey" RENAME TO "verifications_pkey";
ALTER INDEX "passkey_pkey" RENAME TO "passkeys_pkey";

ALTER INDEX "user_email_key" RENAME TO "users_email_key";
ALTER INDEX "user_username_key" RENAME TO "users_username_key";
ALTER INDEX "session_userId_idx" RENAME TO "sessions_userId_idx";
ALTER INDEX "session_token_key" RENAME TO "sessions_token_key";
ALTER INDEX "account_userId_idx" RENAME TO "accounts_userId_idx";
ALTER INDEX "verification_identifier_idx" RENAME TO "verifications_identifier_idx";
ALTER INDEX "passkey_userId_idx" RENAME TO "passkeys_userId_idx";
ALTER INDEX "passkey_credentialID_idx" RENAME TO "passkeys_credentialID_idx";

-- AlterConstraint
ALTER TABLE "sessions" RENAME CONSTRAINT "session_userId_fkey" TO "sessions_userId_fkey";
ALTER TABLE "accounts" RENAME CONSTRAINT "account_userId_fkey" TO "accounts_userId_fkey";
ALTER TABLE "passkeys" RENAME CONSTRAINT "passkey_userId_fkey" TO "passkeys_userId_fkey";

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "organizerProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'PENDING',
    "type" "CampaignType" NOT NULL,
    "category" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "location" TEXT,
    "targetItems" INTEGER,
    "currentItems" INTEGER DEFAULT 0,
    "pixKey" TEXT,
    "bankAccountInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_collection_points" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_collection_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_participants" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_updates" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_accountabilities" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "totalItems" INTEGER NOT NULL,
    "notes" TEXT,
    "evidencesUrls" TEXT[],
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedOnTime" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_accountabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "itemCount" INTEGER,
    "itemDescription" TEXT,
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "OrganizerType" NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "websiteUrl" TEXT,
    "cnpj" TEXT,
    "cpnjVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaigns_status_idx" ON "campaigns"("status");

-- CreateIndex
CREATE INDEX "campaigns_type_idx" ON "campaigns"("type");

-- CreateIndex
CREATE INDEX "campaigns_category_idx" ON "campaigns"("category");

-- CreateIndex
CREATE INDEX "campaigns_region_idx" ON "campaigns"("region");

-- CreateIndex
CREATE INDEX "campaigns_organizerProfileId_idx" ON "campaigns"("organizerProfileId");

-- CreateIndex
CREATE INDEX "campaigns_startDate_endDate_idx" ON "campaigns"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "campaign_collection_points_campaignId_idx" ON "campaign_collection_points"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_participants_campaignId_idx" ON "campaign_participants"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_participants_userId_idx" ON "campaign_participants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_participants_campaignId_userId_key" ON "campaign_participants"("campaignId", "userId");

-- CreateIndex
CREATE INDEX "campaign_updates_campaignId_idx" ON "campaign_updates"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_accountabilities_campaignId_key" ON "campaign_accountabilities"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_accountabilities_campaignId_idx" ON "campaign_accountabilities"("campaignId");

-- CreateIndex
CREATE INDEX "donations_campaignId_idx" ON "donations"("campaignId");

-- CreateIndex
CREATE INDEX "donations_donorId_idx" ON "donations"("donorId");

-- CreateIndex
CREATE INDEX "donations_status_idx" ON "donations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "organizer_profiles_cnpj_key" ON "organizer_profiles"("cnpj");

-- CreateIndex
CREATE INDEX "organizer_profiles_cnpj_idx" ON "organizer_profiles"("cnpj");

-- CreateIndex
CREATE INDEX "organizer_profiles_type_idx" ON "organizer_profiles"("type");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_organizerProfileId_fkey" FOREIGN KEY ("organizerProfileId") REFERENCES "organizer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_collection_points" ADD CONSTRAINT "campaign_collection_points_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_participants" ADD CONSTRAINT "campaign_participants_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_participants" ADD CONSTRAINT "campaign_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_updates" ADD CONSTRAINT "campaign_updates_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_updates" ADD CONSTRAINT "campaign_updates_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_accountabilities" ADD CONSTRAINT "campaign_accountabilities_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer_profiles" ADD CONSTRAINT "organizer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
