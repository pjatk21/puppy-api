-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('reservation', 'workshop', 'lecture', 'other');

-- CreateTable
CREATE TABLE "ScheduledEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "type" "EventType" NOT NULL DEFAULT 'other',
    "groups" TEXT[],
    "room" TEXT,
    "begin" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "hosts" TEXT[],

    CONSTRAINT "ScheduledEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduledEvent_code_idx" ON "ScheduledEvent" USING HASH ("code");

-- CreateIndex
CREATE INDEX "ScheduledEvent_type_idx" ON "ScheduledEvent" USING HASH ("type");

-- CreateIndex
CREATE INDEX "ScheduledEvent_begin_code_idx" ON "ScheduledEvent"("begin" DESC, "code" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledEvent_type_code_begin_end_groups_hosts_room_key" ON "ScheduledEvent"("type", "code", "begin", "end", "groups", "hosts", "room");
