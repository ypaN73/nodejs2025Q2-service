import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf((_, value) => value !== null)
  @IsString()
  artistId: string | null;

  @ValidateIf((_, value) => value !== null)
  @IsString()
  albumId: string | null;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
