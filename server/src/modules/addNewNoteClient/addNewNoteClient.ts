import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';
import { PrismaClient } from '@prisma/client';

exports.addNewNoteClient = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = req.app.get('prisma')

    try{
        // const user_id = req.body.user_id
        const user_id = req.body.user_id;
        
        const client_id = req.body.client_id
        const noteDatas = req.body.notes
        for (let noteData of noteDatas) {
            
            let insertData = {
                user_id: user_id,     
                note_text: noteData.note_text
            }
            
            noteData.note_name ? Object.assign(insertData, {note_name:noteData.note_name}):void 0
            noteData.data_link ? Object.assign(insertData, {data_link:noteData.data_link}):void 0
            noteData.created_at ? Object.assign(insertData, {created_at:noteData.created_at}):void 0    
             
            let note = await prisma.Notes.create({
                data:insertData
            })

            await prisma.ClientNotes.create({
                data: {
                    client_id: client_id,
                    note_id: note.note_id
                }
            });

        }
        
        next();

    } catch (error){

        const response: IResponse = {
            status: 'error',
            display: true,
            error: {error},
            message: 'Błąd dodawania notatek nowego klięta',
            devmessage: `${error}`,
            data: null
        };   

        res.status(404).json(response)
    }
}

const prisma = new PrismaClient();

export const addNewNoteClientbyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { client_id } = req.params;
        const { user_id, notes } = req.body;

        const clientId = parseInt(client_id, 10);
        if (isNaN(clientId)) {
            return res.status(400).json({ status: 'error', message: 'Invalid clientId parameter' });
        }

        const existingClient = await prisma.clients.findUnique({
            where: { client_id: clientId },
        });

        if (!existingClient) {
            return res.status(404).json({ status: 'error', message: 'Client not found' });
        }

        for (let noteData of notes) {
            let insertData: any = {
                user_id: user_id,
                note_text: noteData.note_text,
            };

            if (noteData.note_name) insertData.note_name = noteData.note_name;
            if (noteData.data_link) insertData.data_link = noteData.data_link;
            if (noteData.created_at) insertData.created_at = new Date(noteData.created_at);

            let note = await prisma.notes.create({
                data: insertData,
            });

            await prisma.clientNotes.create({
                data: {
                    client_id: clientId,
                    note_id: note.note_id,
                },
            });
        }

        res.status(201).json({ status: 'success', message: 'Notatki zostały pomyślnie dodane do klienta' });
    } catch (error) {
        console.error('Error adding notes:', error);
        res.status(500).json({ status: 'error', message: 'Błąd dodawania notatek nowego klienta', devMessage: error });
    }
};