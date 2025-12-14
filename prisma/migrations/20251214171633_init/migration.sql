/*
  Warnings:

  - You are about to drop the `Favorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Favorites";

-- CreateTable
CREATE TABLE "FavArtists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "FavArtists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavAlbums" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "FavAlbums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavTracks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "FavTracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavArtists_artistId_key" ON "FavArtists"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "FavAlbums_albumId_key" ON "FavAlbums"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "FavTracks_trackId_key" ON "FavTracks"("trackId");

-- AddForeignKey
ALTER TABLE "FavArtists" ADD CONSTRAINT "FavArtists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavArtists" ADD CONSTRAINT "FavArtists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavAlbums" ADD CONSTRAINT "FavAlbums_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavAlbums" ADD CONSTRAINT "FavAlbums_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavTracks" ADD CONSTRAINT "FavTracks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavTracks" ADD CONSTRAINT "FavTracks_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
