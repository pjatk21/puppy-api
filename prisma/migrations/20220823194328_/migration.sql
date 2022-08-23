-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "token" SET DEFAULT encode(gen_random_bytes(384), 'base64'),
ALTER COLUMN "expiresAfter" SET DEFAULT now() + interval '1 week';
