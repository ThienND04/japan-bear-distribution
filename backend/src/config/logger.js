const winston = require('winston');
const config = require('./config');

/**
 * Custom Winston format to enumerate error properties
 * Converts Error objects to include full stack trace in log message
 * @type {import('winston').Format}
 */
const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

/**
 * Application logger instance
 * Uses debug level in development, info level in production
 * Colorizes output in development mode
 * @type {import('winston').Logger}
 */
const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        enumerateErrorFormat(),
        config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`)
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});

module.exports = logger;