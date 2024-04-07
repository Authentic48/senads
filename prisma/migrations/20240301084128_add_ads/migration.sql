-- CreateTable
CREATE TABLE "ads" (
    "uuid" VARCHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "images" TEXT[],
    "description" TEXT NOT NULL,
    "price" INTEGER,
    "address" TEXT NOT NULL,
    "sub_category_uuid" VARCHAR(36) NOT NULL,
    "profile_uuid" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ads_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "ads" ADD CONSTRAINT "ads_sub_category_uuid_fkey" FOREIGN KEY ("sub_category_uuid") REFERENCES "sub_categories"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ads" ADD CONSTRAINT "ads_profile_uuid_fkey" FOREIGN KEY ("profile_uuid") REFERENCES "profiles"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
