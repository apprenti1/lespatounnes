import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with proper origin handling
  const corsOrigins = process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) || ['http://localhost:5173', 'http://localhost:5174'];

  app.enableCors({
    origin: (requestOrigin, callback) => {
      // If no origin header, allow (same-origin or non-browser requests)
      if (!requestOrigin) {
        callback(null, true);
        return;
      }

      // Check if the request origin is in the allowed list
      const isAllowed = corsOrigins.some((allowedOrigin) => {
        return allowedOrigin === requestOrigin;
      });

      if (isAllowed) {
        // Return the exact origin from the request to avoid duplicates
        callback(null, requestOrigin);
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
