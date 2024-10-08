import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteClient = async (req: Request, res: Response) => {
    const { client_id } = req.params;

    try {
        // Sprawdzamy, czy client_id jest liczbą
        const id = parseInt(client_id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid client_id parameter' });
        }

        // Sprawdzamy, czy klient istnieje
        const client = await prisma.clients.findUnique({ where: { client_id: id } });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Usuwanie powiązanych danych
        try {
            await prisma.clientNotes.deleteMany({ where: { client_id: id } });
        } catch (error) {
            console.error('Error deleting client notes:', error);
            return res.status(500).json({ error: 'Failed to delete client notes' });
        }

        try {
            await prisma.clientTasks.deleteMany({ where: { client_id: id } });
        } catch (error) {
            console.error('Error deleting client tasks:', error);
            return res.status(500).json({ error: 'Failed to delete client tasks' });
        }

        try {
            await prisma.clientEmails.deleteMany({ where: { client_id: id } });
        } catch (error) {
            console.error('Error deleting client emails:', error);
            return res.status(500).json({ error: 'Failed to delete client emails' });
        }

        try {
            await prisma.clientPhones.deleteMany({ where: { client_id: id } });
        } catch (error) {
            console.error('Error deleting client phones:', error);
            return res.status(500).json({ error: 'Failed to delete client phones' });
        }

        try {
            await prisma.invoices.deleteMany({ where: { client_id: id } });
        } catch (error) {
            console.error('Error deleting client invoices:', error);
            return res.status(500).json({ error: 'Failed to delete client invoices' });
        }

        // Usuwanie klienta
        try {
            await prisma.clients.delete({ where: { client_id: id } });
        } catch (error) {
            console.error('Error deleting client:', error);
            return res.status(500).json({ error: 'Failed to delete client' });
        }

        res.status(200).json({ message: 'Client and related data deleted successfully' });
    } catch (error) {
        console.error('Unexpected error during client deletion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
