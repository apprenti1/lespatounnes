import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ResizeService } from './resize.service';
import { UploadController } from './upload.controller';

@Module({
  controllers: [UploadController],
  providers: [UploadService, ResizeService],
  exports: [UploadService, ResizeService],
})
export class UploadModule {}
