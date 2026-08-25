CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- DropIndex
DROP INDEX "campaigns_category_idx";

-- DropIndex
DROP INDEX "campaigns_region_idx";

-- DropIndex
DROP INDEX "campaigns_startDate_endDate_idx";

-- CreateIndex
CREATE INDEX "campaigns_status_startDate_createdAt_id_idx" ON "campaigns"("status", "startDate" ASC, "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "campaigns_status_type_startDate_createdAt_id_idx" ON "campaigns"("status", "type", "startDate" ASC, "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "campaigns_category_idx" ON "campaigns" USING GIN ("category" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "campaigns_region_idx" ON "campaigns" USING GIN ("region" gin_trgm_ops);
