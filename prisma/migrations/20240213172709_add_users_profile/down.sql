-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_user_uuid_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "profiles";

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone" ASC);
