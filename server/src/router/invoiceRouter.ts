import express, { response } from 'express';
import { } from '../modules/invoices/selectAllinvoices';

const router = express.Router()

const { getAllInvoices } = require('../modules/invoices/selectAllinvoices');
const { getAllSettings } = require('../modules/invoices/getInvoiceSettings');
const { updateAllSettings } = require('../modules/invoices/changeInvoiceSettings');
const { updateInvoiceStatus } = require('../modules/invoices/updateInvoiceStatus');


router.post('/test', (req,res,next) =>{
    res.status(200).json({error : "Witamy w fakturach"});
})

// router.get('/', getAllInvoices);
// router.put('/status', updateInvoiceStatus);
// router.get('/settings', getAllSettings);
// router.put('/settings/update', updateAllSettings);
// router.put('/settings/add', updateAllSettings);

const { initInvoiceSite } = require('../modules/invoices/initInvoiceTab');
router.get("/init",initInvoiceSite)

router.use('/', (req,res,next) =>{
    const logger = req.app.get('logger')
    logger.error(`Próba połączenia z nieobsługiwaną sciezką faktury`);
    res.status(404).json({error : "Nie obsługiwana ścieżka"});
})

module.exports = router