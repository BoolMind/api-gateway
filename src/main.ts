import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppLogger } from '@common/logger';
import type { AppConfig } from '@config/index';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(AppLogger));

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app')!;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(appConfig.httpPort);

  app.get(AppLogger).log(
    `API Gateway listening on http://localhost:${appConfig.httpPort}`,
    'Bootstrap',
  );
}

bootstrap();