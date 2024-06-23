import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';



const getLogDirectory = (date: string) => path.join(__dirname, '../../../logs', date);

const createLogDirectories = (date: string) => {
    const logDirectory = getLogDirectory(date);
    const allLogsDir = path.join(logDirectory, 'all');
    const warnLogsDir = path.join(logDirectory, 'warn');
    const errorLogsDir = path.join(logDirectory, 'error');

    fs.mkdirSync(allLogsDir, { recursive: true });
    fs.mkdirSync(warnLogsDir, { recursive: true });
    fs.mkdirSync(errorLogsDir, { recursive: true });

    return { allLogsDir, warnLogsDir, errorLogsDir };
};

// Pobranie dzisiejszej daty
const today = new Date().toISOString().slice(0, 10);
const { allLogsDir, warnLogsDir, errorLogsDir } = createLogDirectories(today);

// Konfiguracja loggera
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    ),
    transports: [
        new winston.transports.DailyRotateFile({
            dirname: allLogsDir,
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            maxFiles: '14d'
        }),
        new winston.transports.DailyRotateFile({
            dirname: warnLogsDir,
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'warn',
            maxFiles: '14d'
        }),
        new winston.transports.DailyRotateFile({
            dirname: errorLogsDir,
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d'
        })
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}


export default logger;