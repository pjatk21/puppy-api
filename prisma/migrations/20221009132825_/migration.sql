-- AlterTable
ALTER TABLE "ScheduleShard" ADD COLUMN     "storedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ScraperToken" ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'hex');

-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'hex'),
ALTER COLUMN "expiresAfter" SET DEFAULT now() + interval '1 week';
