import pino from 'pino';
const options = {
    level: process.env.LOG_LEVEL ||
        (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    messageKey: 'message',
};
if (process.env.NODE_ENV !== 'production') {
    options.transport = {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' },
    };
}
export const pinoLogger = pino(options);
