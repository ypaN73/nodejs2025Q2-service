import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album, albums, tracks, favorites } from '../database/database';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto): Album {
    const album: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };

    albums.push(album);
    return album;
  }

  findAll(): Album[] {
    return albums;
  }

  findOne(id: string): Album {
    const album = albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const albumIndex = albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    const updatedAlbum: Album = {
      ...albums[albumIndex],
      ...updateAlbumDto,
    };

    albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string): void {
    const albumIndex = albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    albums.splice(albumIndex, 1);

    // Remove albumId from tracks
    tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });

    // Remove from favorites
    favorites.albums = favorites.albums.filter((albumId) => albumId !== id);
  }
}
