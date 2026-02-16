import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import pinoHttp from 'pino-http';
import { RequestHandler } from 'express';
import { RequestIdMiddleware } from './logger/request-id.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  // register request id middleware first
  app.use((req, res, next) => new RequestIdMiddleware().use(req, res, next));

  // attach pino http logger middleware
  const opts = {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    serializers: {
      req: (req: any) => ({ id: req.id, method: req.method, url: req.url }),
      res: (res: any) => ({ statusCode: res.statusCode }),
    },
  } as const;
  const pinoMiddleware = (pinoHttp as unknown as (opts?: unknown) => RequestHandler)(opts);
  app.use(pinoMiddleware);

  // set Nest logger to use console (pino will handle HTTP logs); keep Nest logs minimal
  // Global validation pipe using class-validator and class-transformer
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

  // Global exception filter for consistent API error responses
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

void bootstrap();
