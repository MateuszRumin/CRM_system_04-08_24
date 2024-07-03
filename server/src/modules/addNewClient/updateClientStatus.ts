// src/controllers/updateClientStatus.ts

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { IResponse } from '../../../../globalTypes/iResponce';

const prisma = new PrismaClient();

export const updateClientStatus = async (req: Request, res: Response) => {
    const { client_id } = req.params;
    const { status_id } = req.body;

    try {
        const id = parseInt(client_id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid clientId parameter' });
        }

        const statusId = parseInt(status_id, 10);
        if (isNaN(statusId)) {
            return res.status(400).json({ error: 'Invalid status_id parameter' });
        }

        const status = await prisma.statuses.findUnique({
            where: {
                status_id: statusId,
            },
        });

        if (!status) {
            return res.status(404).json({ error: 'Status not found' });
        }

        // Aktualizujemy status klienta
        const updatedClient = await prisma.clients.update({
            where: {
                client_id: id,
            },
            data: {
                status_id: statusId,
            },
        });

        // Pobieramy zaktualizowane dane klienta z nowym statusem
        const clientWithStatus = await prisma.clients.findUnique({
            where: {
                client_id: id,
            },
            include: {
                Status: true,
            },
        });

        res.status(200).json(clientWithStatus);
    } catch (error) {
        console.error('Error updating client status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};