// src/controllers/addClientContact.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { IResponse } from '../../../../globalTypes/iResponce';

const prisma = new PrismaClient();

export const addClientContact = async (req: Request, res: Response) => {
    try {
        const { client_id, first_name, second_name, email, tel_number } = req.body;

        const newClientContact = await prisma.clientContacts.create({
            data: {
                client_id,
                first_name,
                second_name,
                email: email || 'Brak',
                tel_number: tel_number || 'Brak', 
            },
        });

        const response: IResponse = {
            status: 'success',
            display: true,
            error: null,
            message: 'Dane kontaktowe klienta zostały dodane pomyślnie',
            devmessage: 'Successfully added client contact data to the database',
            data: newClientContact,
        };

        res.status(201).json(response);
    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd podczas dodawania danych kontaktowych klienta',
            devmessage: `${error}`,
            data: null,
        };

        res.status(500).json(response);
    }
};