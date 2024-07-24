import { Router } from 'express';
import { selectClientStatuses } from '../modules/statuses/clientStatus'
import { selectProjectStatuses } from '../modules/statuses/projectStatus'
import { selectTaskStatuses } from '../modules/statuses/taskStatus'
import { selectInvoiceStatuses } from '../modules/statuses/invoiceStatus'

import {  } from '../modules/statuses/clientStatus'
import {  } from '../modules/statuses/projectStatus'
import {  } from '../modules/statuses/taskStatus'
import {  } from '../modules/statuses/invoiceStatus'

const router = Router();

//wyswietlenie statusow
router.get('/project', selectProjectStatuses);
router.get('/task', selectTaskStatuses);
router.get('/client', selectClientStatuses);
router.get('/invoice', selectInvoiceStatuses);

//zmiana statusow
router.put('/project/:project_id/:status_id',);
router.put('/task/:task_id/:status_id', );
router.put('/client/:client_id/:status_id', );
router.put('/invoice/:invoice_id/:status_id', );

module.exports = router