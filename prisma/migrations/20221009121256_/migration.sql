/*
  Warnings:

  - Added the required column `args` to the `ScrapJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScrapJob" ADD COLUMN     "args" JSON NOT NULL;

-- AlterTable
ALTER TABLE "ScraperToken" ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'hex');

-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'hex'),
ALTER COLUMN "expiresAfter" SET DEFAULT now() + interval '1 week';

-- CreateTable
CREATE TABLE "ScraperChannel" (
    "id" UUID NOT NULL,
    "scraperId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "ScraperChannel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScraperChannel" ADD CONSTRAINT "ScraperChannel_scraperId_fkey" FOREIGN KEY ("scraperId") REFERENCES "Scraper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
