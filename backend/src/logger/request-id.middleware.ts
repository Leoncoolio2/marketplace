import { Injectable, NestMiddleware } from '@nestjs/common';
import expressRequestId from 'express-request-id';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import type { Logger } from 'pino';

interface ReqWithId extends Request {
  id?: string;
  log?: Logger;
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: ReqWithId, res: Response, next: NextFunction): void {
    const assignReqId: RequestHandler = expressRequestId();
    assignReqId(req, res, () => {
      const start = process.hrtime();
      res.on('finish', () => {
        const diff = process.hrtime(start);
        const responseTimeMs = diff[0] * 1e3 + diff[1] / 1e6;
        const logger = req.log ?? (console as unknown as Logger);
        logger.info?.({
          time: new Date().toISOString(),
          requestId: req.id,
          context: 'HTTP',
          method: req.method,
          url: req.originalUrl ?? req.url,
          statusCode: res.statusCode,
          responseTimeMs: Math.round(responseTimeMs),
        }, 'request completed');
      });
      next();
    });
  }
}
