import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import logger from './modules/logger/logger'
const cors = require('cors')
// import cors from 'cors';

// Konfiguracja dotenv
dotenv.config();

// Inicjalizacja aplikacji express
const app = express();
app.use(cors())

//import loggera
app.set('logger', logger);
app.use(express.json());

// Obsługa CORS
app.use(cors());

//inicjalizacja klienta prisma
const prisma = new PrismaClient();
app.set('prisma', prisma);

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

// Sprawdzenie połączenia z bazą danych
async function checkDatabaseConnection() {
    try {
        await prisma.$connect();
        // logger.info('Connected to database');
        console.log('Connected to database');
    } catch (error) {
        // logger.error(`Database connection Error: ${error}`);
        console.log(`Database connection error`);
        //process.exit(1);
    }
}

checkDatabaseConnection();