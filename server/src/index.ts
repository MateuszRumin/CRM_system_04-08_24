import express from 'express';
import dotenv from 'dotenv';
import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
// import { PrismaClient } from '@prisma/client';

// Konfiguracja dotenv
dotenv.config();

// Inicjalizacja aplikacji express
const app = express();

// Ustawienie zmiennej daty dla folderów logów
const getLogDirectory = (date: string) => path.join(__dirname, '../logs', date);

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

app.set('logger', logger);

// Inicjalizacja Prisma Client
// const prisma = new PrismaClient();
// app.set('prisma', prisma);

// Middleware
app.use(express.json());

// Przykładowa trasa
app.get('/api/test', (req, res) => {
    const logger = req.app.get('logger');
    logger.info('Test route called');
    res.json({ message: 'Test route' });
});

// Start serwera
const port = process.env.PORT || 3303;
app.listen(port, () => {
    const logger = app.get('logger');
    logger.info(`Server running on port ${port}`);
    console.log(`Server running on port ${port}`);
});