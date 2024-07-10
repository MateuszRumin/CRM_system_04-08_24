import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';

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














