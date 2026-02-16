import pino from 'pino';

// Use any-cast to avoid type mismatches across pino versions
const options: any = {
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  messageKey: 'message',
};
if (process.env.NODE_ENV !== 'production') {
  // use pino-pretty in development via transport if available
  options.transport = { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } };
}

export const pinoLogger = (pino as any)(options);
