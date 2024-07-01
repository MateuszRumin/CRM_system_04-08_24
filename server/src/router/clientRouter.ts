import express, { response } from 'express';

const router = express.Router()

router.post('/test', (req,res,next) =>{
    res.status(200).json({error : "Witamy w kliencie"});
})

const {addNewClient} = require('../modules/addNewClient/addNewClient')
const {updateClientStatus} = require('../modules/addNewClient/updateClientStatus')
const {updateClientData} = require('../modules/addNewClient/updateClientData')
const {addClientContact} = require('../modules/addNewClient/addClientContacts')
const {addNewNoteClient} = require('../modules/addNewNoteClient/addNewNoteClient')
const {addNewTaskClient} = require("../modules/addNewTaskClient/addNewTaskClient")
const {updateTaskStatus} = require('../modules/addNewTaskClient/updateTaskClient')
const {getTasksClient} = require('../modules/addNewTaskClient/getTasksClient')
const {selectAllClients} = require ('../modules/selectAllClients/selectAllClients');

// Trasy związane z klientami
router.post('/client/new', addNewClient, addNewNoteClient, addNewTaskClient, addClientContact);
router.put('/client/status', updateClientStatus);
router.put('/client/data', updateClientData);
router.post('/client/contact', addClientContact);
router.get('/clients', selectAllClients);

// Trasy związane z taskami
router.put('/task/status', updateTaskStatus);
router.get('/client/:client_id/tasks', getTasksClient);

router.use('/', (req,res,next) =>{
    const logger = req.app.get('logger')
    logger.error(`Próba połączenia z nieobsługiwaną scierzką klient`);
    res.status(404).json({error : "Nie obsługiwana ścieżka"});
})

module.exports = router