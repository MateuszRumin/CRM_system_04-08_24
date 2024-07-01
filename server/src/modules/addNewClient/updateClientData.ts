// src/controllers/updateClientData.ts

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { IResponse } from '../../../../globalTypes/iResponce';

const prisma = new PrismaClient();

export const updateClientData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { client_id, client } = req.body;

        // Sprawdzenie, czy klient istnieje
        const existingClient = await prisma.clients.findUnique({
            where: {
                client_id: client_id,
            },
        });

        if (!existingClient) {
            const response: IResponse = {
                status: 'error',
                display: true,
                error: { message: `Klient o id ${client_id} nie istnieje` },
                message: 'Błąd podczas aktualizacji danych klienta',
                devmessage: `Klient o id ${client_id} nie istnieje`,
                data: null,
            };
            return res.status(404).json(response);
        }

        // Aktualizacja danych klienta
        const updatedClient = await prisma.clients.update({
            where: {
                client_id: client_id,
            },
            data: {
                status_id: existingClient.status_id, // Może być potrzebne do aktualizacji statusu klienta
                user_id: existingClient.user_id, // Może być potrzebne do aktualizacji user_id
                client_type: client.client_type,
                first_name: client.first_name,
                second_name: client.second_name,
                address: client.address,
                registration_date: client.registration_date,
                regon: client.regon,
                nip: client.nip,
                krs: client.krs,
                company_name: client.company_name,
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
            message: 'Błąd podczas aktualizacji danych klienta',
            devmessage: `${error}`,
            data: null,
        };

        res.status(500).json(response);
    }
};

