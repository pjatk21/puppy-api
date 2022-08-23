-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('admin', 'scrappersCrud', 'scrappersRead');

-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'base64'),
ALTER COLUMN "expiresAfter" SET DEFAULT now() + interval '1 week';

-- CreateTable
CREATE TABLE "UserPermissions" (
    "userId" UUID NOT NULL,
    "permission" "Permission" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPermissions_userId_permission_key" ON "UserPermissions"("userId", "permission");

-- AddForeignKey
ALTER TABLE "UserPermissions" ADD CONSTRAINT "UserPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
