import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import pinoHttp from 'pino-http';
import pino from 'pino';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: false,
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    const logger = pino({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: { colorize: true },
            }
            : undefined,
    });
    const httpLogger = pinoHttp({
        logger,
    });
    app.use((req, res, next) => {
        httpLogger(req, res);
        next();
    });
    await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
void bootstrap();
