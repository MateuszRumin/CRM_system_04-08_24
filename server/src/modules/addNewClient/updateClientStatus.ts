// src/controllers/updateClientStatus.ts

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { IResponse } from '../../../../globalTypes/iResponce';

const prisma = new PrismaClient();

export const updateClientStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { client_id, status_name } = req.body;

        // Pobranie nowego statusu klienta
        const newStatus = await prisma.statuses.findFirst({
            select: {
                status_id: true,
            },
            where: {
                name: status_name,
                status_type: 'Klient',
            },
        });

        if (!newStatus) {
            const response: IResponse = {
                status: 'error',
                display: true,
                error: { message: `Nie znaleziono statusu o nazwie ${status_name}` },
                message: 'Błąd podczas aktualizacji statusu klienta',
                devmessage: `Nie znaleziono statusu o nazwie ${status_name}`,
                data: null,
            };
            return res.status(404).json(response);
        }

        // Aktualizacja klienta
        const updatedClient = await prisma.clients.update({
            where: {
                client_id: client_id,
            },
            data: {
                status_id: newStatus.status_id,
            },
        });

        req.body.client_id = updatedClient.client_id;
        req.body.user_id = updatedClient.user_id; // Może być potrzebne, jeśli chcesz przekazać dalej do kolejnych middleware lub routera

        next(); // Przekazanie dalej do następnego middleware lub routera

    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd podczas aktualizacji statusu klienta',
            devmessage: `${error}`,
            data: null,
        };

        res.status(500).json(response);
    }
};