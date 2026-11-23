import { PartialType } from '@nestjs/mapped-types';
import { CreateLowonganDto } from './create-lowongan.dto.js';

export class UpdateLowonganDto extends PartialType(CreateLowonganDto) {}
