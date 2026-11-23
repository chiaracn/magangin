import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LowonganModule } from './lowongan/lowongan.module.js';

@Module({
  imports: [LowonganModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
