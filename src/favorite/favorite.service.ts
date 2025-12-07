import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    const favorites = await this.getFavorites();

    const artists = await this.prisma.artist.findMany({
      where: {
        id: { in: favorites.artists },
      },
    });

    const albums = await this.prisma.album.findMany({
      where: {
        id: { in: favorites.albums },
      },
    });

    const tracks = await this.prisma.track.findMany({
      where: {
        id: { in: favorites.tracks },
      },
    });

    return { artists, albums, tracks };
  }

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const favorites = await this.getFavorites();

    if (!favorites.tracks.includes(id)) {
      favorites.tracks.push(id);
      await this.prisma.favorites.update({
        where: { id: 1 },
        data: { tracks: favorites.tracks },
      });
    }
  }

  async removeTrack(id: string) {
    const favorites = await this.getFavorites();
    const trackIndex = favorites.tracks.indexOf(id);

    if (trackIndex === -1) {
      throw new HttpException('Track not found in favorites', HttpStatus.NOT_FOUND);
    }

    favorites.tracks.splice(trackIndex, 1);
    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { tracks: favorites.tracks },
    });
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new HttpException('Album not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const favorites = await this.getFavorites();

    if (!favorites.albums.includes(id)) {
      favorites.albums.push(id);
      await this.prisma.favorites.update({
        where: { id: 1 },
        data: { albums: favorites.albums },
      });
    }
  }

  async removeAlbum(id: string) {
    const favorites = await this.getFavorites();
    const albumIndex = favorites.albums.indexOf(id);

    if (albumIndex === -1) {
      throw new HttpException('Album not found in favorites', HttpStatus.NOT_FOUND);
    }

    favorites.albums.splice(albumIndex, 1);
    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { albums: favorites.albums },
    });
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const favorites = await this.getFavorites();

    if (!favorites.artists.includes(id)) {
      favorites.artists.push(id);
      await this.prisma.favorites.update({
        where: { id: 1 },
        data: { artists: favorites.artists },
      });
    }
  }

  async removeArtist(id: string) {
    const favorites = await this.getFavorites();
    const artistIndex = favorites.artists.indexOf(id);

    if (artistIndex === -1) {
      throw new HttpException('Artist not found in favorites', HttpStatus.NOT_FOUND);
    }

    favorites.artists.splice(artistIndex, 1);
    await this.prisma.favorites.update({
      where: { id: 1 },
      data: { artists: favorites.artists },
    });
  }

  private async getFavorites() {
    let favorites = await this.prisma.favorites.findUnique({
      where: { id: 1 },
    });

    if (!favorites) {
      favorites = await this.prisma.favorites.create({
        data: { artists: [], albums: [], tracks: [] },
      });
    }

    return favorites;
  }
}