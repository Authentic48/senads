-- DropForeignKey
ALTER TABLE "ads" DROP CONSTRAINT "ads_sub_category_uuid_fkey";

-- DropForeignKey
ALTER TABLE "ads" DROP CONSTRAINT "ads_profile_uuid_fkey";

-- DropTable
DROP TABLE "ads";

