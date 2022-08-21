/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `ScrapperToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ScrapperToken_token_key" ON "ScrapperToken"("token");
