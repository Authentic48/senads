-- AlterTable
CREATE SEQUENCE cities_id_seq;
ALTER TABLE "cities" ALTER COLUMN "id" SET DEFAULT nextval('cities_id_seq');
ALTER SEQUENCE cities_id_seq OWNED BY "cities"."id";

-- AlterTable
CREATE SEQUENCE regions_id_seq;
ALTER TABLE "regions" ALTER COLUMN "id" SET DEFAULT nextval('regions_id_seq');
ALTER SEQUENCE regions_id_seq OWNED BY "regions"."id";
