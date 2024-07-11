import express, { response } from 'express';

const router = express.Router()

const {addNewClient} = require('../modules/addNewClient/addNewClient')
const {updateClientStatus} = require('../modules/addNewClient/updateClientStatus')
const {updateClientData} = require('../modules/addNewClient/updateClientData')
const {addClientContact, addClientMailTel} = require('../modules/addNewClient/addClientContacts')
const {addNewNoteClient, addNewNoteClientbyId} = require('../modules/addNewNoteClient/addNewNoteClient')
const {addNewTaskClient, addNewTaskClientbyId} = require("../modules/addNewTaskClient/addNewTaskClient")
const {updateTaskStatus, updateClientTask} = require('../modules/addNewTaskClient/updateTaskClient')
const {getTasksClient} = require('../modules/addNewTaskClient/getTasksClient')
const {deleteClientTask} = require('../modules/addNewTaskClient/deleteTaskClient')
const {selectAllClients} = require ('../modules/selectAllClients/selectAllClients');
const {deleteClient} = require('../modules/addNewClient/deleteClientById')
const {getClientById} = require('../modules/addNewClient//getClientById')
const {getClientNotes} = require('../modules/addNewNoteClient/getClientNotesById')
const {updateClientNote} = require('../modules/addNewNoteClient/editClientNoteById')
const {deleteClientNote} = require('../modules/addNewNoteClient/deleteClientNoteById')

router.post('/test', (req,res,next) =>{
    res.status(200).json({error : "Witamy w kliencie"});
})

// Dodanei klienta wraz z innymi danymi
router.post('/new', addNewClient, addNewNoteClient, addNewTaskClient, addClientMailTel, (req, res) => {
    res.status(201).json({ message: 'Client, notes, tasks, and contacts added successfully' });
});

// Notatki
router.get('/:client_id/notes', getClientNotes);
router.put('/notes/:note_id', updateClientNote);
router.delete('/:client_id/notes/:note_id', deleteClientNote);
router.get('/:client_id/notes', getClientNotes);
router.post('/:client_id/notes', addNewNoteClientbyId);

// Klienci i kontakty
router.put('/:client_id/status', updateClientStatus);
router.put('/:client_id/update', updateClientData);
router.get('/:client_id/get', getClientById);
router.delete('/:client_id/delete', deleteClient);
router.post('/:client_id/contact', addClientContact);
router.get('/', selectAllClients);

// Trasy związane z taskami
router.patch('/tasks/:task_id', updateTaskStatus);
router.put('/tasks/:task_id', updateClientTask);
router.get('/:client_id/tasks', getTasksClient);
router.delete('/:client_id/tasks/:task_id', deleteClientTask);
router.post('/:client_id/tasks/', addNewTaskClientbyId);

router.use('/', (req,res,next) =>{
    const logger = req.app.get('logger')
    logger.error(`Próba połączenia z nieobsługiwaną sciezką klient`);
    res.status(404).json({error : "Nie obsługiwana ścieżka"});
})

module.exports = router