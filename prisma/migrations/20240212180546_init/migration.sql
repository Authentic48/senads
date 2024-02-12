-- CreateEnum
CREATE TYPE "ERole" AS ENUM ('BUSINESS', 'ADMIN', 'MANAGER');

-- CreateTable
CREATE TABLE "users" (
    "uuid" VARCHAR(36) NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "sessions" (
    "uuid" VARCHAR(36) NOT NULL,
    "user_uuid" VARCHAR(36) NOT NULL,
    "device_uuid" VARCHAR(36) NOT NULL,
    "refresh_token" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "session_access_tokens" (
    "access_token_uuid" VARCHAR(36) NOT NULL,
    "session_uuid" VARCHAR(36),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "roles" (
    "uuid" VARCHAR(36) NOT NULL,
    "name" "ERole" NOT NULL DEFAULT 'BUSINESS',
    "user_uuid" VARCHAR(36) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_device_uuid_key" ON "sessions"("device_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refresh_token_key" ON "sessions"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "session_access_tokens_access_token_uuid_key" ON "session_access_tokens"("access_token_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "session_access_tokens_session_uuid_key" ON "session_access_tokens"("session_uuid");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_access_tokens" ADD CONSTRAINT "session_access_tokens_session_uuid_fkey" FOREIGN KEY ("session_uuid") REFERENCES "sessions"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
