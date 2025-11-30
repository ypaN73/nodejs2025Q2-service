import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import {
  Artist,
  artists,
  albums,
  tracks,
  favorites,
} from '../database/database';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  create(createArtistDto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };

    artists.push(artist);
    return artist;
  }

  findAll(): Artist[] {
    return artists;
  }

  findOne(id: string): Artist {
    const artist = artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artistIndex = artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    const updatedArtist: Artist = {
      ...artists[artistIndex],
      ...updateArtistDto,
    };

    artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string): void {
    const artistIndex = artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    artists.splice(artistIndex, 1);

    // Remove artistId from albums
    albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    // Remove artistId from tracks
    tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });

    // Remove from favorites
    favorites.artists = favorites.artists.filter((artistId) => artistId !== id);
  }
}
