import pino from 'pino';
import PinoHttp from 'pino-http';

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export const loggerHttp = PinoHttp({
  msgPrefix: 'Server',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});
