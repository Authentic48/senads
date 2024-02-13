-- DropForeignKey
ALTER TABLE "sub_categories" DROP CONSTRAINT "sub_categories_category_uuid_fkey";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "sub_categories";
