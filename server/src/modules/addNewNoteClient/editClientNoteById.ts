import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateClientNote = async (req: Request, res: Response) => {
    const { note_id, client_id } = req.params;
    const { note_name, note_text, data_link } = req.body;

    try {
        const id = parseInt(note_id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid note_id parameter' });
        }

        const existingNote = await prisma.notes.findUnique({
            where: { note_id: id }
        });

        if (!existingNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Aktualizujemy dane notatki
        const updatedNote = await prisma.notes.update({
            where: { note_id: id },
            data: {
                note_name,
                note_text,
                data_link
            }
        });

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};