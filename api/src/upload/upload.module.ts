import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ResizeService } from './resize.service';

@Module({
  providers: [UploadService, ResizeService],
  exports: [UploadService, ResizeService],
})
export class UploadModule {}
