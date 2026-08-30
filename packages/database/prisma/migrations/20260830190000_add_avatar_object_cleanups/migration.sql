CREATE TABLE "avatar_object_cleanups" (
    "id" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avatar_object_cleanups_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "avatar_object_cleanups_objectKey_key"
ON "avatar_object_cleanups"("objectKey");

CREATE INDEX "avatar_object_cleanups_updatedAt_idx"
ON "avatar_object_cleanups"("updatedAt");
