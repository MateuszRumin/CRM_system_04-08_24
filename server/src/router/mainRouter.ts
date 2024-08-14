import express from 'express';
const router = express.Router();

const clientRouter = require('./clientRouter');
router.use('/client', clientRouter);

const userRouter = require('./userRouter');
// router.use('/users', userRouter);

router.use('/employees', userRouter);

const invoiceRouter = require('./invoiceRouter');
router.use('/invoices', invoiceRouter);

const permissionRouter = require('./permissionRouter');
router.use('/permissions', permissionRouter);

const projectRouter = require('./projectRouter');
router.use('/projects', projectRouter);

const statusRouter = require('./statusRouter');
router.use('/statuses', statusRouter);

const emailRouter = require('./emailRouter');
router.use('/email', emailRouter);

router.get('/test', (req,res,next) =>{
    res.status(200).json({error : "Witamy w crm"});
})

router.use('/', (req,res,next) =>{
    const logger = req.app.get('logger')
    logger.error(`Próba połączenia z nieobsługiwaną scierzką`);
    res.status(404).json({error : "Nie obsługiwana ścieżka"});
})

module.exports = router