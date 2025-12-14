/*
  Warnings:

  - You are about to drop the `FavAlbums` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavArtists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavTracks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavAlbums" DROP CONSTRAINT "FavAlbums_albumId_fkey";

-- DropForeignKey
ALTER TABLE "FavAlbums" DROP CONSTRAINT "FavAlbums_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavArtists" DROP CONSTRAINT "FavArtists_artistId_fkey";

-- DropForeignKey
ALTER TABLE "FavArtists" DROP CONSTRAINT "FavArtists_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavTracks" DROP CONSTRAINT "FavTracks_trackId_fkey";

-- DropForeignKey
ALTER TABLE "FavTracks" DROP CONSTRAINT "FavTracks_userId_fkey";

-- DropTable
DROP TABLE "FavAlbums";

-- DropTable
DROP TABLE "FavArtists";

-- DropTable
DROP TABLE "FavTracks";

-- CreateTable
CREATE TABLE "Favorites" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "artists" TEXT[],
    "albums" TEXT[],
    "tracks" TEXT[],

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);
