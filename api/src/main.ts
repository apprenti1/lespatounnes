import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS - normalize origins to avoid duplicates
  const corsOrigins = process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) || ['http://localhost:5173', 'http://localhost:5174'];
  app.enableCors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || corsOrigins.some((allowedOrigin) => {
        // Normalize by removing port 80/443 and comparing
        const normalized = allowedOrigin.replace(/:80$/, '').replace(/:443$/, '');
        const requestNormalized = requestOrigin.replace(/:80$/, '').replace(/:443$/, '');
        return normalized === requestNormalized;
      })) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Augmenter les limites de payload pour les uploads d'images
  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
