import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track, tracks, favorites } from '../database/database';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto): Track {
    const track: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };

    tracks.push(track);
    return track;
  }

  findAll(): Track[] {
    return tracks;
  }

  findOne(id: string): Track {
    const track = tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const trackIndex = tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    const updatedTrack: Track = {
      ...tracks[trackIndex],
      ...updateTrackDto,
    };

    tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string): void {
    const trackIndex = tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    tracks.splice(trackIndex, 1);

    // Remove from favorites
    favorites.tracks = favorites.tracks.filter((trackId) => trackId !== id);
  }
}
