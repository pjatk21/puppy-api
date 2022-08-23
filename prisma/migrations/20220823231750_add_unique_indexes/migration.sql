/*
  Warnings:

  - The primary key for the `ScrapperToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ScrapperToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[alias,ownerId]` on the table `Scrapper` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token,scrapperId]` on the table `ScrapperToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ScrapperToken" DROP CONSTRAINT "ScrapperToken_scrapperId_fkey";

-- AlterTable
ALTER TABLE "ScrapperToken" DROP CONSTRAINT "ScrapperToken_pkey",
DROP COLUMN "id",
ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'base64');

-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'base64'),
ALTER COLUMN "expiresAfter" SET DEFAULT now() + interval '1 week';

-- CreateIndex
CREATE UNIQUE INDEX "Scrapper_alias_ownerId_key" ON "Scrapper"("alias", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapperToken_token_scrapperId_key" ON "ScrapperToken"("token", "scrapperId");

-- AddForeignKey
ALTER TABLE "ScrapperToken" ADD CONSTRAINT "ScrapperToken_scrapperId_fkey" FOREIGN KEY ("scrapperId") REFERENCES "Scrapper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
