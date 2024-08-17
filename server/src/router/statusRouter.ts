import { Router } from 'express';
import { selectClientStatuses } from '../modules/statuses/clientStatus'
import { selectProjectStatuses } from '../modules/statuses/projectStatus'
import { selectTaskStatuses } from '../modules/statuses/taskStatus'
import { selectInvoiceStatuses } from '../modules/statuses/invoiceStatus'
import { selectPaymentStatuses } from '../modules/statuses/paymentStatus'

import { updateClientStatus } from '../modules/statuses/clientStatus'
import { updateProjectStatus } from '../modules/statuses/projectStatus'
import { updateTaskStatus } from '../modules/statuses/taskStatus'
import { updateInvoiceStatus } from '../modules/statuses/invoiceStatus'
import { updatePaymentStatus } from '../modules/statuses/paymentStatus'

const router = Router();

//wyswietlenie statusow
router.get('/project', selectProjectStatuses);
router.get('/task', selectTaskStatuses);
router.get('/client', selectClientStatuses);
router.get('/invoice', selectInvoiceStatuses);
router.get('/payment', selectPaymentStatuses);

//zmiana statusow
router.put('/project/:project_id/:status_id', updateProjectStatus);
router.put('/task/:task_id/:status_id', updateTaskStatus);
router.put('/client/:client_id/:status_id', updateClientStatus);
router.put('/invoice/:invoice_id/:status_id', updateInvoiceStatus);
router.put('/payment/:payment_id/:status_id', updatePaymentStatus);

module.exports = router