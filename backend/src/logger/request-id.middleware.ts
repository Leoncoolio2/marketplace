import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

interface SimpleLogger {
  info: (meta: unknown) => void;
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(
    req: Request & { id?: string; log?: unknown },
    res: Response,
    next: NextFunction,
  ): void {
    req.id = randomUUID();

    const start = Date.now();

    res.on('finish', () => {
      const responseTimeMs = Date.now() - start;

      const logger = req.log as SimpleLogger | undefined;
      if (logger && typeof logger.info === 'function') {
        logger.info({
          requestId: req.id,
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          responseTimeMs,
        });
      }
    });

    next();
  }
}
