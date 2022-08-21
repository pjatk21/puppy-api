/*
  Warnings:

  - Added the required column `ownerId` to the `Scrapper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scrapper" ADD COLUMN     "ownerId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Scrapper" ADD CONSTRAINT "Scrapper_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
