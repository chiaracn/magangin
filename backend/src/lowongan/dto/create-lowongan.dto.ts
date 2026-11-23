import { IsArray, IsIn, IsInt, IsNumber, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLowonganDto {
  @IsString()
  @MinLength(3)
  posisi: string;

  @IsString()
  @MinLength(2)
  perusahaan: string;

  @IsString()
  @MinLength(2)
  lokasi: string;

  @IsIn(['Remote', 'Onsite', 'Hybrid'])
  tipe: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  durasi: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gaji: number;

  @IsString()
  @MinLength(10)
  deskripsi: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];
}
