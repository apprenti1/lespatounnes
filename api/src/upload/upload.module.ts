import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ResizeService } from './resize.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 999 * 1024 * 1024, // 999 MB max per file
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, ResizeService],
  exports: [UploadService, ResizeService],
})
export class UploadModule {}
