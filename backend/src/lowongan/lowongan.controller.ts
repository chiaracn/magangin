import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LowonganService } from './lowongan.service.js';
import { CreateLowonganDto } from './dto/create-lowongan.dto.js';
import { UpdateLowonganDto } from './dto/update-lowongan.dto.js';

@Controller('lowongan')
export class LowonganController {
  constructor(private readonly lowonganService: LowonganService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLowonganDto: CreateLowonganDto) {
    return this.lowonganService.create(createLowonganDto);
  }

  @Get()
  findAll() {
    return this.lowonganService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lowonganService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLowonganDto: UpdateLowonganDto,
  ) {
    return this.lowonganService.update(id, updateLowonganDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lowonganService.remove(id);
  }
}
