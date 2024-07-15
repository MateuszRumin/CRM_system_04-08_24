import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClientNotes = async (req: Request, res: Response) => {
    const { client_id } = req.params;

    try {
        const id = parseInt(client_id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid client_id parameter' });
        }

        const clientNotes = await prisma.clientNotes.findMany({
            where: { client_id: id },
            include: {
                Note: true 
            }
        });

        if (clientNotes.length === 0) {
            return res.status(404).json({ error: 'No notes found for this client' });
        }

        const notesDetails = clientNotes.map((clientNote) => clientNote.Note);

        res.status(200).json(notesDetails);
    } catch (error) {
        console.error('Error fetching notes for client:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};