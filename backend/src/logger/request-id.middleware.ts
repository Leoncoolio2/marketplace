import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import type { Logger } from 'pino';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request & { id?: string; log?: any }, res: Response, next: NextFunction): void {
    req.id = randomUUID();

    const start = Date.now();

    res.on('finish', () => {
      const responseTimeMs = Date.now() - start;

      if (req.log) {
        req.log.info({
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
