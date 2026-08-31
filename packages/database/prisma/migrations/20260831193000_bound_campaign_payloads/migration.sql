BEGIN;

-- NOT VALID preserves rows accepted before these bounds existed while enforcing
-- the limits for all future inserts and updates.
ALTER TABLE "campaigns"
  ADD CONSTRAINT "campaigns_title_length_check" CHECK (char_length("title") <= 120) NOT VALID,
  ADD CONSTRAINT "campaigns_description_length_check" CHECK (char_length("description") <= 4000) NOT VALID,
  ADD CONSTRAINT "campaigns_category_length_check" CHECK (char_length("category") <= 80) NOT VALID,
  ADD CONSTRAINT "campaigns_region_length_check" CHECK (char_length("region") <= 120) NOT VALID,
  ADD CONSTRAINT "campaigns_location_length_check" CHECK (char_length("location") <= 200) NOT VALID,
  ADD CONSTRAINT "campaigns_pix_key_length_check" CHECK (char_length("pixKey") <= 100) NOT VALID,
  ADD CONSTRAINT "campaigns_bank_account_info_length_check" CHECK (char_length("bankAccountInfo") <= 1000) NOT VALID;

ALTER TABLE "campaign_collection_points"
  ADD CONSTRAINT "campaign_collection_points_name_length_check" CHECK (char_length("name") <= 120) NOT VALID,
  ADD CONSTRAINT "campaign_collection_points_address_length_check" CHECK (char_length("address") <= 255) NOT VALID,
  ADD CONSTRAINT "campaign_collection_points_city_length_check" CHECK (char_length("city") <= 120) NOT VALID,
  ADD CONSTRAINT "campaign_collection_points_state_length_check" CHECK (char_length("state") <= 60) NOT VALID,
  ADD CONSTRAINT "campaign_collection_points_zip_code_length_check" CHECK (char_length("zipCode") <= 20) NOT VALID,
  ADD CONSTRAINT "campaign_collection_points_instructions_length_check" CHECK (char_length("instructions") <= 500) NOT VALID;

ALTER TABLE "campaign_updates"
  ADD CONSTRAINT "campaign_updates_message_length_check" CHECK (char_length("message") <= 2000) NOT VALID;

ALTER TABLE "campaign_accountabilities"
  ADD CONSTRAINT "campaign_accountabilities_outcome_summary_length_check" CHECK (char_length("outcomeSummary") <= 4000) NOT VALID;

ALTER TABLE "campaign_assets"
  ADD CONSTRAINT "campaign_assets_original_file_name_length_check" CHECK (char_length("originalFileName") <= 255) NOT VALID;

ALTER TABLE "organizer_profiles"
  ADD CONSTRAINT "organizer_profiles_display_name_length_check" CHECK (char_length("displayName") <= 120) NOT VALID,
  ADD CONSTRAINT "organizer_profiles_bio_length_check" CHECK (char_length("bio") <= 1000) NOT VALID,
  ADD CONSTRAINT "organizer_profiles_website_url_length_check" CHECK (char_length("websiteUrl") <= 2048) NOT VALID;

DROP INDEX "campaigns_organizerProfileId_idx";
DROP INDEX "campaign_participants_userId_idx";

CREATE INDEX "campaigns_organizerProfileId_createdAt_id_idx"
  ON "campaigns"("organizerProfileId", "createdAt" DESC, "id" DESC);

CREATE INDEX "campaign_participants_userId_cancelledAt_confirmedAt_id_idx"
  ON "campaign_participants"("userId", "cancelledAt", "confirmedAt" DESC, "id" DESC);

COMMIT;
