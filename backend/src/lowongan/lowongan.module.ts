import { Module } from '@nestjs/common';
import { LowonganService } from './lowongan.service.js';
import { LowonganController } from './lowongan.controller.js';

@Module({
  controllers: [LowonganController],
  providers: [LowonganService],
})
export class LowonganModule {}
