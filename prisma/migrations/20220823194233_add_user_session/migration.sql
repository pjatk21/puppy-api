-- Enable crypto extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateTable
CREATE TABLE "UserSession" (
    "token" TEXT NOT NULL DEFAULT encode(gen_random_bytes(384), 'base64'),
    "userId" UUID NOT NULL,
    "expiresAfter" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '1 week',

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_token_key" ON "UserSession"("token");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
