import express, { response } from 'express';
import { } from '../modules/invoices/selectAllinvoices';

const router = express.Router()

const { getAllInvoices } = require('../modules/invoices/selectAllinvoices');
const { getAllSettings } = require('../modules/invoices/getInvoiceSettings');
const { updateAllSettings } = require('../modules/invoices/changeInvoiceSettings');
const { updateInvoiceStatus } = require('../modules/invoices/updateInvoiceStatus');
const { addInvoiceProducts } = require ('../modules/invoices/addInvoiceProduckts');
const { caculateInvProducts } = require ('../modules/invoices/calculateInvProducts');
const { deleteInvoice } = require ('../modules/invoices/delateInvoicebyId');
const { getInvoiceDetails } = require ('../modules/invoices/getInvoiceDetailsById');

router.post('/test', (req,res,next) =>{
    res.status(200).json({error : "Witamy w fakturach"});
})

router.get('/', getAllInvoices);//
router.put('/status', updateInvoiceStatus);//
router.get('/settings', getAllSettings);
router.put('/settings/update', updateAllSettings);//
router.put('/settings/add', updateAllSettings);//
router.delete('/:invoice_id', deleteInvoice);


const { initInvoiceSite } = require('../modules/invoices/initInvoiceTab');
router.get("/init",initInvoiceSite);

const { addInvoice, updateInvoice } = require('../modules/invoices/addInvoice');
router.post("/newInvoice",addInvoice);//
router.post('/addInvoiceProduct', addInvoiceProducts);// 
router.post('/calculateProduct', caculateInvProducts);// 
router.get('/:invoice_id', getInvoiceDetails);//

//update
router.post("/updateInvoice", updateInvoice); //



router.use('/', (req,res,next) =>{
    const logger = req.app.get('logger')
    logger.error(`Próba połączenia z nieobsługiwaną sciezką faktury`);
    res.status(404).json({error : "Nie obsługiwana ścieżka"});
})

module.exports = router