-- CreateTable
CREATE TABLE "playlists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problemInPlaylist" (
    "id" TEXT NOT NULL,
    "playlistid" TEXT NOT NULL,
    "problemid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problemInPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "playlists_userid_name_key" ON "playlists"("userid", "name");

-- CreateIndex
CREATE UNIQUE INDEX "problemInPlaylist_playlistid_problemid_key" ON "problemInPlaylist"("playlistid", "problemid");

-- AddForeignKey
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problemInPlaylist" ADD CONSTRAINT "problemInPlaylist_playlistid_fkey" FOREIGN KEY ("playlistid") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problemInPlaylist" ADD CONSTRAINT "problemInPlaylist_problemid_fkey" FOREIGN KEY ("problemid") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
