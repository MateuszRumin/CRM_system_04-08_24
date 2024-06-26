import express, { response } from 'express';

const router = express.Router()




router.post('/test', (req,res,next) =>{
    res.status(200).json({error : "Witamy w kliencie"});
})




const {addNewClient} = require('../modules/addNewClient/addNewClient')
const {addNewNoteClient} = require('../modules/addNewNoteClient/addNewNoteClient')
const {addNewTaskClient} = require("../modules/addNewTaskClient/addNewTaskClient")
router.post('/NewClient', addNewClient,addNewNoteClient,addNewTaskClient)


const  {selectAllClients} = require('../modules/selectAllClients/selectAllClients')
router.post('/listAllClient',selectAllClients)




router.use('/', (req,res,next) =>{
    const logger = req.app.get('logger')
    logger.error(`Próba połączenia z nieobsługiwaną scierzką klient`);
    res.status(404).json({error : "Nie obsługiwana ścieżka"});
})


module.exports = router