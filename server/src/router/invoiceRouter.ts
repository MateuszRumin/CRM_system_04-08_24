import express, { response } from 'express';

const router = express.Router()

router.post('/test', (req,res,next) =>{
    res.status(200).json({error : "Witamy w fakturach"});
})










router.use('/', (req,res,next) =>{
    const logger = req.app.get('logger')
    logger.error(`Próba połączenia z nieobsługiwaną sciezką faktury`);
    res.status(404).json({error : "Nie obsługiwana ścieżka"});
})

module.exports = router