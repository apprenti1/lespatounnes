import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HelloAssoModule } from './helloasso/helloasso.module';
import { UploadModule } from './upload/upload.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HelloAssoModule,
    UploadModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
