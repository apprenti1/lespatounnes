import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HelloAssoModule } from './helloasso/helloasso.module';
import { UploadModule } from './upload/upload.module';
import { EventsModule } from './events/events.module';
import { PhotosModule } from './photos/photos.module';
import { AdminModule } from './admin/admin.module';
import { PartnersModule } from './partners/partners.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HelloAssoModule,
    UploadModule,
    EventsModule,
    PhotosModule,
    AdminModule,
    PartnersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
