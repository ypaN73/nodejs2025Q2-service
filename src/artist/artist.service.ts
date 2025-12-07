import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) { }

  async create(createArtistDto: CreateArtistDto) {
    return this.prisma.artist.create({
      data: createArtistDto,
    });
  }

  async findAll() {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });
  }

  async remove(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.$transaction([
      this.prisma.artist.delete({
        where: { id },
      }),
      this.prisma.album.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      }),
      this.prisma.track.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      }),
    ]);
  }
}