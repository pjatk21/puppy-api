/*
  Warnings:

  - You are about to drop the column `groups` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "groups";

-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'base64'),
ALTER COLUMN "expiresAfter" SET DEFAULT now() + interval '1 week';

-- CreateTable
CREATE TABLE "UserGroups" (
    "userId" UUID NOT NULL,
    "group" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGroups_userId_group_key" ON "UserGroups"("userId", "group");

-- AddForeignKey
ALTER TABLE "UserGroups" ADD CONSTRAINT "UserGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
