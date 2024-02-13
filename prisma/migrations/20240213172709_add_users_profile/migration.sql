/*
  Warnings:

  - You are about to drop the column `is_phone_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_phone_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_phone_verified",
DROP COLUMN "phone";

-- CreateTable
CREATE TABLE "profiles" (
    "uuid" VARCHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "user_uuid" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_phone_key" ON "profiles"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_uuid_key" ON "profiles"("user_uuid");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
