import { HttpException, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { StatusCodes } from 'http-status-codes';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    return this.prisma.album.create({
      data: { ...createAlbumDto },
    });
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album)
      throw new HttpException("album doesn't exists", StatusCodes.NOT_FOUND);

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album)
      throw new HttpException("album doesn't exists", StatusCodes.NOT_FOUND);

    return await this.prisma.album.update({
      where: { id },
      data: { ...updateAlbumDto },
    });
  }

  async remove(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album)
      throw new HttpException("album doesn't exists", StatusCodes.NOT_FOUND);

    await this.prisma.$transaction([
      this.prisma.album.delete({
        where: { id },
      }),
      this.prisma.track.updateMany({
        where: { albumId: id },
        data: { albumId: null },
      }),
    ]);
  }
}
