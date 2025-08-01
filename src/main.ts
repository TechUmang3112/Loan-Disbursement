// Imports
import { join } from 'path';
import * as env from 'dotenv';
import * as express from 'express';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './middleware/jwt/auth.guard';

env.config({ quiet: true });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  const server_port = process.env.SERVER_PORT ?? 3001;
  await app.listen(server_port);
  console.log(`Server started on ${server_port}`);
}

bootstrap();
