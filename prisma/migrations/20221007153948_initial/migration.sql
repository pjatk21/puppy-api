-- Load PGCrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('queued', 'pending', 'succeeded', 'failed');

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
CREATE TABLE "Scraper" (
    "id" UUID NOT NULL,
    "alias" TEXT,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "Scraper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScraperToken" (
    "token" TEXT NOT NULL DEFAULT encode(gen_random_bytes(384), 'hex'),
    "scraperId" UUID NOT NULL,
    "when" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ScrapJob" (
    "id" SERIAL NOT NULL,
    "workerId" UUID,
    "status" "JobStatus" NOT NULL DEFAULT 'queued',
    "queuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "ScrapJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleShard" (
    "id" SERIAL NOT NULL,
    "sourceJobId" INTEGER NOT NULL,
    "receivedPayload" BYTEA NOT NULL,

    CONSTRAINT "ScheduleShard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleClass" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "ScheduleClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleReservation" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "ScheduleReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_token_key" ON "UserSession"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Scraper_alias_ownerId_key" ON "Scraper"("alias", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ScraperToken_token_key" ON "ScraperToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ScraperToken_token_scraperId_key" ON "ScraperToken"("token", "scraperId");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scraper" ADD CONSTRAINT "Scraper_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScraperToken" ADD CONSTRAINT "ScraperToken_scraperId_fkey" FOREIGN KEY ("scraperId") REFERENCES "Scraper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrapJob" ADD CONSTRAINT "ScrapJob_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Scraper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleShard" ADD CONSTRAINT "ScheduleShard_sourceJobId_fkey" FOREIGN KEY ("sourceJobId") REFERENCES "ScrapJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleClass" ADD CONSTRAINT "ScheduleClass_id_fkey" FOREIGN KEY ("id") REFERENCES "ScheduleShard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleReservation" ADD CONSTRAINT "ScheduleReservation_id_fkey" FOREIGN KEY ("id") REFERENCES "ScheduleShard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Set STORAGE EXTERNAL
ALTER TABLE "ScheduleShard" ALTER COLUMN "receivedPayload" SET STORAGE EXTERNAL;
