import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { artists, albums, tracks, favorites } from '../database/database';

@Injectable()
export class FavoriteService {
  findAll() {
    return {
      artists: artists.filter((artist) =>
        favorites.artists.includes(artist.id),
      ),
      albums: albums.filter((album) => favorites.albums.includes(album.id)),
      tracks: tracks.filter((track) => favorites.tracks.includes(track.id)),
    };
  }

  addTrack(id: string): void {
    const track = tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!favorites.tracks.includes(id)) {
      favorites.tracks.push(id);
    }
  }

  removeTrack(id: string): void {
    const trackIndex = favorites.tracks.indexOf(id);
    if (trackIndex === -1) {
      throw new HttpException(
        'Track not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    favorites.tracks.splice(trackIndex, 1);
  }

  addAlbum(id: string): void {
    const album = albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!favorites.albums.includes(id)) {
      favorites.albums.push(id);
    }
  }

  removeAlbum(id: string): void {
    const albumIndex = favorites.albums.indexOf(id);
    if (albumIndex === -1) {
      throw new HttpException(
        'Album not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    favorites.albums.splice(albumIndex, 1);
  }

  addArtist(id: string): void {
    const artist = artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException(
        'Artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!favorites.artists.includes(id)) {
      favorites.artists.push(id);
    }
  }

  removeArtist(id: string): void {
    const artistIndex = favorites.artists.indexOf(id);
    if (artistIndex === -1) {
      throw new HttpException(
        'Artist not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    favorites.artists.splice(artistIndex, 1);
  }
}
