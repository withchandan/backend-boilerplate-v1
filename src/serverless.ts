import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import { configure as serverlessExpress } from '@vendia/serverless-express';

import { AppModule } from './app.module';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule, { cors: true });

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

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());

  return server(event, context, callback);
};
