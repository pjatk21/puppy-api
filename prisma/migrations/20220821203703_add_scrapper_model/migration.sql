-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('reservation', 'exam', 'workshop', 'lecture', 'other');

-- CreateTable
CREATE TABLE "ScheduledEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "type" "EventType" NOT NULL DEFAULT 'other',
    "groups" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "room" TEXT NOT NULL,
    "begin" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "hosts" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "ScheduledEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scrapper" (
    "id" UUID NOT NULL,
    "alias" TEXT,

    CONSTRAINT "Scrapper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapperToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "scrapperId" UUID NOT NULL,
    "when" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapperToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduledEvent_code_idx" ON "ScheduledEvent" USING HASH ("code");

-- CreateIndex
CREATE INDEX "ScheduledEvent_type_idx" ON "ScheduledEvent" USING HASH ("type");

-- CreateIndex
CREATE INDEX "ScheduledEvent_begin_code_idx" ON "ScheduledEvent"("begin" DESC, "code" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledEvent_type_groups_begin_code_key" ON "ScheduledEvent"("type", "groups", "begin", "code");

-- AddForeignKey
ALTER TABLE "ScrapperToken" ADD CONSTRAINT "ScrapperToken_scrapperId_fkey" FOREIGN KEY ("scrapperId") REFERENCES "Scrapper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
