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
const {selectAllClients} = require ('../modules/selectAllClients/selectAllClients')
const {deleteClient} = require('../modules/addNewClient/deleteClientById')
const {getClientById} = require('../modules/addNewClient//getClientById')
const {getClientNotes} = require('../modules/addNewNoteClient/getClientNotesById')
const {updateClientNote} = require('../modules/addNewNoteClient/editClientNoteById')
const {deleteClientNote} = require('../modules/addNewNoteClient/deleteClientNoteById')
const { fetchRegonData } =  require('../modules/ClientRegon/clientController')

router.post('/test', (req, res, next) => {
    res.status(200).json({ error: "Witamy w kliencie" });
});

// Dodanie nowego klienta wraz z innymi danymi
router.post('/new', addNewClient, addNewNoteClient, addNewTaskClient, addClientMailTel, (req, res) => {
    let message = 'Dodano nowego klienta';

    if (req.body.notes && req.body.notes.length > 0) {
        message += ' + notatki';
    }
    if (req.body.tasks && req.body.tasks.length > 0) {
        message += ' + zadania';
    }
    if (req.body.emails && req.body.emails.length > 0) {
        message += ' + e-maile';
    }
    if (req.body.phones && req.body.phones.length > 0) {
        message += ' + telefony';
    }

    res.status(201).json({ message });
});

// Notatki
router.get('/:client_id/notes', getClientNotes);
router.put('/notes/:note_id', updateClientNote);
router.delete('/notes/:note_id', deleteClientNote);
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
router.delete('/tasks/:task_id', deleteClientTask);
router.post('/:client_id/tasks/', addNewTaskClientbyId);

// Nowy endpoint do pobierania danych z REGON
router.post('/fetch-regon-data', fetchRegonData);

router.use('/', (req, res, next) => {
    const logger = req.app.get('logger');
    logger.error(`Próba połączenia z nieobsługiwaną ścieżką klient`);
    res.status(404).json({ error: "Nie obsługiwana ścieżka" });
});

module.exports = router;