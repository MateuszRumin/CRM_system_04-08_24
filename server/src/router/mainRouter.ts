import express from 'express';

const router = express.Router()




const clientRouter = require('./clientRouter')
router.use('/client',clientRouter)




router.get('/test', (req,res,next) =>{
    res.status(200).json({error : "Witamy w crm"});
})


router.use('/', (req,res,next) =>{
    const logger = req.app.get('logger')
    logger.error(`Próba połączenia z nieobsługiwaną scierzką`);
    res.status(404).json({error : "Nie obsługiwana ścieżka"});
})




module.exports = router










