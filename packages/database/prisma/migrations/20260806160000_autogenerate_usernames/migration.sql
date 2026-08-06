DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "users"
    WHERE "username" IS NULL
      AND "id" !~* '^[0-9A-HJKMNP-TV-Z]{26}$'
  ) THEN
    RAISE EXCEPTION 'Cannot backfill usernames: one or more user IDs are not valid ULIDs';
  END IF;
END $$;

UPDATE "users"
SET "username" = 'usr_' || lower("id")
WHERE "username" IS NULL;

UPDATE "users"
SET "displayUsername" = "username"
WHERE "displayUsername" IS NULL;

ALTER TABLE "users"
  ALTER COLUMN "username" SET NOT NULL,
  DROP COLUMN "onboarded";
