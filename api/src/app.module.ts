import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HelloAssoModule } from './helloasso/helloasso.module';

@Module({
  imports: [PrismaModule, AuthModule, HelloAssoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
