import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import logger from './modules/logger/logger'

// Konfiguracja dotenv
dotenv.config();

// Inicjalizacja aplikacji express
const app = express();

//import loggera
app.set('logger', logger);
app.use(express.json());





// Inicjalizacja Prisma Client
try {
    const prisma = new PrismaClient();
    app.set('../../prisma', prisma);
}catch (error)  {
    logger.error(`Database connection Error: ${error}`)
    console.log(`Database connection Error: ${error}`)
}

// przekierownie routningu
const route = require('./router/mainRouter')
app.use(route)


//start servera
const port = process.env.PORT || 3303;
try {
app.listen(port, () => {
    const logger = app.get('logger');
    logger.info(`Server running on port ${port}`);
    console.log(`Server running on port ${port}`);
})} catch (error) {
    logger.error(`Failed to start server: ${error}`)
    console.log(`Failed to start server: ${error}`)
}



