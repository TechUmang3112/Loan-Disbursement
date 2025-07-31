// Imports
import * as env from 'dotenv';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

env.config({ quiet: true });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const server_port = process.env.SERVER_PORT ?? 3001;
  await app.listen(server_port);
  console.log(`Server started on ${server_port}`);
}

bootstrap();
