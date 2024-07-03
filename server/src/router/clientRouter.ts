import express, { response } from 'express';

const router = express.Router()

const {addNewClient} = require('../modules/addNewClient/addNewClient')
const {updateClientStatus} = require('../modules/addNewClient/updateClientStatus')
const {updateClientData} = require('../modules/addNewClient/updateClientData')
const {addClientContact} = require('../modules/addNewClient/addClientContacts')
const {addNewNoteClient} = require('../modules/addNewNoteClient/addNewNoteClient')
const {addNewTaskClient} = require("../modules/addNewTaskClient/addNewTaskClient")
const {updateTaskStatus} = require('../modules/addNewTaskClient/updateTaskClient')
const {getTasksClient} = require('../modules/addNewTaskClient/getTasksClient')
const {selectAllClients} = require ('../modules/selectAllClients/selectAllClients');

router.post('/test', (req,res,next) =>{
    res.status(200).json({error : "Witamy w kliencie"});
})

// Trasy związane z klientami
router.post('/new', addNewClient, addNewNoteClient, addNewTaskClient, addClientContact);
router.put('/:client_id/status', updateClientStatus);
router.put('/:client_id/update', updateClientData);
router.post('/contact', addClientContact);
router.get('/', selectAllClients);

// Trasy związane z taskami
router.patch('/:task_id/status', updateTaskStatus);
router.get('/:client_id/tasks', getTasksClient);

router.use('/', (req,res,next) =>{
    const logger = req.app.get('logger')
    logger.error(`Próba połączenia z nieobsługiwaną scierzką klient`);
    res.status(404).json({error : "Nie obsługiwana ścieżka"});
})

module.exports = router