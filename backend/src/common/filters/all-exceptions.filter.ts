import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { pinoLogger } from '../../logger/pino.provider';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR as number;
    let message = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        // Use a safe typed access instead of ts-ignore
        const resObj = res as Record<string, unknown>;
        if (typeof resObj.message === 'string') message = resObj.message;
        if (typeof resObj.error === 'string') error = resObj.error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error,
    };

    // Structured error log using pino
    const reqAny = request as unknown as { id?: string };
    pinoLogger.error(
      {
        timestamp: new Date().toISOString(),
        requestId: reqAny.id,
        context: 'Exceptions',
        method: request.method,
        url: request.url,
        status,
        error: error,
        message,
        stack: exception instanceof Error ? exception.stack : undefined,
      },
      'unhandled exception',
    );

    response.status(status).json(responseBody);
  }
}
