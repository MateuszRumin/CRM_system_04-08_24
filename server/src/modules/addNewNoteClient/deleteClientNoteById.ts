import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteClientNote = async (req: Request, res: Response) => {
    const { note_id, client_id } = req.params;

    try {
        const noteId = parseInt(note_id, 10);
        const clientId = parseInt(client_id, 10);

        if (isNaN(noteId) || isNaN(clientId)) {
            return res.status(400).json({ error: 'Invalid note_id or client_id parameter' });
        }

        const existingNote = await prisma.notes.findUnique({
            where: { note_id: noteId }
        });

        if (!existingNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Usuwamy rekord z tabeli ClientNotes
        await prisma.clientNotes.deleteMany({
            where: {
                note_id: noteId,
                client_id: clientId
            }
        });

        // Usuwamy notatkę
        await prisma.notes.delete({
            where: { note_id: noteId }
        });

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};