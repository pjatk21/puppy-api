CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('reservation', 'exam', 'workshop', 'lecture', 'other');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('admin', 'scrappersCrud', 'scrappersRead');

-- CreateTable
CREATE TABLE "ScheduledEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "type" "EventType" NOT NULL DEFAULT 'other',
    "groups" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "room" TEXT NOT NULL,
    "begin" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "hosts" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "ScheduledEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "token" TEXT NOT NULL DEFAULT encode(gen_random_bytes(384), 'hex'),
    "userId" UUID NOT NULL,
    "expiresAfter" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '1 week',

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "UserPermissions" (
    "userId" UUID NOT NULL,
    "permission" "Permission" NOT NULL
);

-- CreateTable
CREATE TABLE "UserGroups" (
    "userId" UUID NOT NULL,
    "group" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Scrapper" (
    "id" UUID NOT NULL,
    "alias" TEXT,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "Scrapper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapperToken" (
    "token" TEXT NOT NULL DEFAULT encode(gen_random_bytes(384), 'hex'),
    "scrapperId" UUID NOT NULL,
    "when" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "ScheduledEvent_code_idx" ON "ScheduledEvent" USING HASH ("code");

-- CreateIndex
CREATE INDEX "ScheduledEvent_type_idx" ON "ScheduledEvent" USING HASH ("type");

-- CreateIndex
CREATE INDEX "ScheduledEvent_begin_code_idx" ON "ScheduledEvent"("begin" DESC, "code" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledEvent_type_groups_begin_code_key" ON "ScheduledEvent"("type", "groups", "begin", "code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_token_key" ON "UserSession"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermissions_userId_permission_key" ON "UserPermissions"("userId", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "UserGroups_userId_group_key" ON "UserGroups"("userId", "group");

-- CreateIndex
CREATE UNIQUE INDEX "Scrapper_alias_ownerId_key" ON "Scrapper"("alias", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapperToken_token_key" ON "ScrapperToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapperToken_token_scrapperId_key" ON "ScrapperToken"("token", "scrapperId");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermissions" ADD CONSTRAINT "UserPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroups" ADD CONSTRAINT "UserGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scrapper" ADD CONSTRAINT "Scrapper_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrapperToken" ADD CONSTRAINT "ScrapperToken_scrapperId_fkey" FOREIGN KEY ("scrapperId") REFERENCES "Scrapper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
