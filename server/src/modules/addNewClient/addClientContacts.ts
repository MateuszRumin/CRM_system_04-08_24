// src/controllers/addClientContact.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { IResponse } from '../../../../globalTypes/iResponce';

const prisma = new PrismaClient();

export const addClientContact = async (req: Request, res: Response) => {
    const { client_id, first_name, second_name, email, tel_number } = req.body;

    try {
        // Sprawdzamy, czy client_id jest liczbą
        if (!client_id || !first_name || !second_name) {
            return res.status(400).json({ error: 'client_id, first_name, and second_name are required' });
        }

        // Tworzymy nowe dane kontaktowe
        const newClientContact = await prisma.clientContacts.create({
            data: {
                client_id,
                first_name,
                second_name,
                email: email || 'Brak',
                tel_number: tel_number || 'Brak',
            },
        });

        res.status(201).json(newClientContact);
    } catch (error) {
        console.error('Error creating client contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};