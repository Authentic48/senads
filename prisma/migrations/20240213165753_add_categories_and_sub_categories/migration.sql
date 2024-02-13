-- CreateTable
CREATE TABLE "categories" (
    "uuid" VARCHAR(36) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "sub_categories" (
    "uuid" VARCHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "category_uuid" VARCHAR(36) NOT NULL,

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sub_categories_name_key" ON "sub_categories"("name");

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_uuid_fkey" FOREIGN KEY ("category_uuid") REFERENCES "categories"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
