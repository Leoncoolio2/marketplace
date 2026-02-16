import pino from 'pino';

// Keep types explicit to satisfy eslint rules
type PinoOptions = pino.LoggerOptions & { transport?: Record<string, unknown> };
const options: PinoOptions = {
  level:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  messageKey: 'message',
};
if (process.env.NODE_ENV !== 'production') {
  options.transport = {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard' },
  };
}

export const pinoLogger = pino(options as pino.LoggerOptions);
