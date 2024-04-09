-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_region_id_fkey";

-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_profile_uuid_fkey";

-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_ad_uuid_fkey";

-- DropForeignKey
ALTER TABLE "profile_social_medias" DROP CONSTRAINT "profile_social_medias_profile_uuid_fkey";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "address",
DROP COLUMN "site";

-- AlterTable
ALTER TABLE "ads" DROP COLUMN "brand",
DROP COLUMN "conditions",
DROP COLUMN "features",
DROP COLUMN "is_price_negotiable",
DROP COLUMN "model",
DROP COLUMN "status",
DROP COLUMN "year",
ADD COLUMN     "address" TEXT NOT NULL;

-- DropTable
DROP TABLE "regions";

-- DropTable
DROP TABLE "cities";

-- DropTable
DROP TABLE "profile_social_medias";

-- DropEnum
DROP TYPE "ECondition";

-- DropEnum
DROP TYPE "ESocialMediaType";

-- DropEnum
DROP TYPE "EAdStatus";
