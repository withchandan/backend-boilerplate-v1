import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]): unknown =>
        new BadRequestException(errors),
      transform: true,
      whitelist: true,
      dismissDefaultMessages: false,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: true,
        value: true,
      },
    }),
  );

  await app.listen(9000);
}

bootstrap();
