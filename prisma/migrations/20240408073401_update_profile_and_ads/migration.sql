-- CreateEnum
CREATE TYPE "ECondition" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "ESocialMediaType" AS ENUM ('FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'TIKTOK', 'WHATSAPP', 'TELEGRAM', 'YT');

-- CreateEnum
CREATE TYPE "EAdStatus" AS ENUM ('ACTIVE', 'EXPIRED');

-- AlterTable
ALTER TABLE "ads" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "conditions" "ECondition",
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "is_price_negotiable" BOOLEAN DEFAULT false,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "status" "EAdStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "year" TEXT,
ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "address" TEXT,
ADD COLUMN     "site" TEXT;

-- CreateTable
CREATE TABLE "regions" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "area" TEXT,
    "region_id" INTEGER,
    "profile_uuid" VARCHAR(36),
    "ad_uuid" VARCHAR(36),

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_social_medias" (
    "uuid" VARCHAR(36) NOT NULL,
    "network" "ESocialMediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "profile_uuid" VARCHAR(36),

    CONSTRAINT "profile_social_medias_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "cities_profile_uuid_key" ON "cities"("profile_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "cities_ad_uuid_key" ON "cities"("ad_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "profile_social_medias_profile_uuid_network_key" ON "profile_social_medias"("profile_uuid", "network");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_profile_uuid_fkey" FOREIGN KEY ("profile_uuid") REFERENCES "profiles"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_ad_uuid_fkey" FOREIGN KEY ("ad_uuid") REFERENCES "ads"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_social_medias" ADD CONSTRAINT "profile_social_medias_profile_uuid_fkey" FOREIGN KEY ("profile_uuid") REFERENCES "profiles"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
