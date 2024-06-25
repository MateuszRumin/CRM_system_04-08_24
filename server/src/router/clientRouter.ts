import express, { response } from 'express';
import logger from '../modules/logger/logger'
const router = express.Router()




router.post('/test', (req,res,next) =>{
    res.status(200).json({error : "Witamy w kliencie"});
})




const {addNewClient} = require('../modules/addNewClient/addNewClient')
router.post('/NewClient', addNewClient)








router.use('/', (req,res,next) =>{
    logger.error(`Próba połączenia z nieobsługiwaną scierzką klient`);
    res.status(404).json({error : "Nie obsługiwana ścieżka"});
})


module.exports = router