-- CreateTable
CREATE TABLE "Rooms" (
    "title" TEXT NOT NULL,
    "roomid" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL,
    "locked" TEXT NOT NULL DEFAULT 'true'
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" SERIAL NOT NULL,
    "roomid" TEXT NOT NULL,
    "user" TEXT NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_roomid_key" ON "Rooms"("roomid");
