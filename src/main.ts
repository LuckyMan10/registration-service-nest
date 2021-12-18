import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import {ValidationPipe} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(5000);
}
bootstrap();
