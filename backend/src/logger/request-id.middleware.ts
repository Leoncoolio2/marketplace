import { Injectable, NestMiddleware } from '@nestjs/common';
import * as expressRequestId from 'express-request-id';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request & { id?: string, log?: any }, res: Response, next: NextFunction) {
    const assignReqId = expressRequestId();
    assignReqId(req as any, res as any, () => {
      const start = process.hrtime();
      res.on('finish', () => {
        const diff = process.hrtime(start);
        const responseTimeMs = diff[0] * 1e3 + diff[1] / 1e6;
        const logger = (req as any).log || console;
        logger.info({
          time: new Date().toISOString(),
          requestId: (req as any).id,
          context: 'HTTP',
          method: req.method,
          url: (req as any).originalUrl || req.url,
          statusCode: res.statusCode,
          responseTimeMs: Math.round(responseTimeMs),
        }, 'request completed');
      });
      next();
    });
  }
}
