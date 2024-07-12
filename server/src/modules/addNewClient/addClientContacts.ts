import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { IResponse } from '../../../../globalTypes/iResponce';

const prisma = new PrismaClient();

export const addClientMailTel = async (req: Request, res: Response, next: NextFunction) => {
    const { emails, phones } = req.body;
    const client_id = req.body.client_id;

    try {
        const clientId = parseInt(client_id, 10);
        if (isNaN(clientId)) {
            return res.status(400).json({ error: 'Invalid client_id parameter' });
        }

        const existingClient = await prisma.clients.findUnique({
            where: { client_id: clientId }
        });

        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Dodawanie e-maili
        if (emails && emails.length > 0) {
            for (const email of emails) {
                await prisma.clientEmails.create({
                    data: {
                        client_id: clientId,
                        email: email
                    }
                });
            }
        }

        // Dodawanie numerów telefonów
        if (phones && phones.length > 0) {
            for (const phone of phones) {
                await prisma.clientPhones.create({
                    data: {
                        client_id: clientId,
                        tel_number: phone
                    }
                });
            }
        }

        next();
    } catch (error) {

        const response: IResponse = {
            status: 'error',
            display: true,
            error: {error},
            message: 'Błąd dodawania kontaktow nowego klięta',
            devmessage: `${error}`,
            data: null
        };   

        res.status(404).json(response)
    }
};

export const addClientContact = async (req: Request, res: Response) => {
    const { client_id } = req.params;
    const { emails, phones } = req.body;

    try {
        const clientId = parseInt(client_id, 10);
        if (isNaN(clientId)) {
            return res.status(400).json({ error: 'Invalid client_id parameter' });
        }

        const existingClient = await prisma.clients.findUnique({
            where: { client_id: clientId }
        });

        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        if (emails && Array.isArray(emails)) {
            for (const email of emails) {
                await prisma.clientEmails.create({
                    data: {
                        client_id: clientId,
                        email: email
                    }
                });
            }
        }

        if (phones && Array.isArray(phones)) {
            for (const phone of phones) {
                await prisma.clientPhones.create({
                    data: {
                        client_id: clientId,
                        tel_number: phone
                    }
                });
            }
        }

        res.status(201).json({ message: 'Contacts added successfully' });
    } catch (error) {
        console.error('Error adding contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};