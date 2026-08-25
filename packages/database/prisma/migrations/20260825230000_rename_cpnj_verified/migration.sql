-- Preserve the existing verification values while correcting the column typo.
ALTER TABLE "organizer_profiles" RENAME COLUMN "cpnjVerified" TO "cnpjVerified";
