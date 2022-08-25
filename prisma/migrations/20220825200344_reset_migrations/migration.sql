-- AlterTable
ALTER TABLE "ScrapperToken" ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'hex');

-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'hex'),
ALTER COLUMN "expiresAfter" SET DEFAULT now() + interval '1 week';
