import express, { response } from 'express';
import { } from '../modules/invoices/selectAllinvoices';

const router = express.Router()

const { getAllInvoices } = require('../modules/invoices/selectAllinvoices');
const { getAllSettings } = require('../modules/invoices/getInvoiceSettings');
const { updateAllSettings } = require('../modules/invoices/changeInvoiceSettings');
const { updateInvoiceStatus } = require('../modules/invoices/updateInvoiceStatus');
const { addInvocieClientCheck } = require ('../modules/invoices/addInvoiceProduckts');
const { caculateInvProducts } = require ('../modules/invoices/calculateInvProducts');
const { deleteInvoice } = require ('../modules/invoices/delateInvoicebyId');

router.post('/test', (req,res,next) =>{
    res.status(200).json({error : "Witamy w fakturach"});
})

router.get('/', getAllInvoices);//
router.put('/status', updateInvoiceStatus);//
router.get('/settings', getAllSettings);
router.put('/settings/update', updateAllSettings);//
router.put('/settings/add', updateAllSettings);//
router.delete('/delete', deleteInvoice);


const { initInvoiceSite } = require('../modules/invoices/initInvoiceTab');
router.get("/init",initInvoiceSite);

const { addInvoice } = require('../modules/invoices/addInvoice');
router.post("/newInvoice",addInvoice);//
router.post('/addInvoiceClientCheck', addInvocieClientCheck);// 
router.post('/calculateProduct', caculateInvProducts);// 

//update
router.post("/updateInvoice", addInvoice); //



router.use('/', (req,res,next) =>{
    const logger = req.app.get('logger')
    logger.error(`Próba połączenia z nieobsługiwaną sciezką faktury`);
    res.status(404).json({error : "Nie obsługiwana ścieżka"});
})

module.exports = router