import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const selectClientStatuses = async (req: Request, res: Response) => {
    try {
        const clientStatuses = await prisma.statuses.findMany({
            where: {
                status_type: 'Klient'
            }
        });
        res.status(200).json(clientStatuses);
    } catch (error) {
        console.error('Error fetching client statuses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateClientStatus = async (req: Request, res: Response) => {
    const { client_id, status_id } = req.params;

    try {
        const statusExists = await prisma.statuses.findUnique({
            where: { status_id: parseInt(status_id, 10) }
        });

        if (!statusExists) {
            return res.status(400).json({ error: 'Status not found' });
        }

        const updatedClient = await prisma.clients.update({
            where: { client_id: parseInt(client_id, 10) },
            data: { status_id: parseInt(status_id, 10) }
        });

        res.status(200).json(updatedClient);
    } catch (error) {
        console.error('Error updating client status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};