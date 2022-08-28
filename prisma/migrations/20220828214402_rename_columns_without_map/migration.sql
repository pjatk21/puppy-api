/*
  Warnings:

  - The values [scrappersCrud,scrappersRead] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Scrapper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScrapperToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('admin', 'scrapersCrud', 'scrapersRead');
ALTER TABLE "UserPermissions" ALTER COLUMN "permission" TYPE "Permission_new" USING ("permission"::text::"Permission_new");
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "Permission_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Scrapper" DROP CONSTRAINT "Scrapper_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ScrapperToken" DROP CONSTRAINT "ScrapperToken_scrapperId_fkey";

-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'hex'),
ALTER COLUMN "expiresAfter" SET DEFAULT now() + interval '1 week';

-- DropTable
DROP TABLE "Scrapper";

-- DropTable
DROP TABLE "ScrapperToken";

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

-- CreateIndex
CREATE UNIQUE INDEX "Scraper_alias_ownerId_key" ON "Scraper"("alias", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ScraperToken_token_key" ON "ScraperToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ScraperToken_token_scraperId_key" ON "ScraperToken"("token", "scraperId");

-- AddForeignKey
ALTER TABLE "Scraper" ADD CONSTRAINT "Scraper_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScraperToken" ADD CONSTRAINT "ScraperToken_scraperId_fkey" FOREIGN KEY ("scraperId") REFERENCES "Scraper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
