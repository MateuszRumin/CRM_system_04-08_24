import express from 'express';
import dotenv from 'dotenv';
import winston from 'winston';
// import { PrismaClient } from '@prisma/client';

// Konfiguracja dotenv
dotenv.config();

// Inicjalizacja aplikacji express
const app = express();

// Konfiguracja loggera
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
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
    console.log(`Server running on port ${port}`);
});
