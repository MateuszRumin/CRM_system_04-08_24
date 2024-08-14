import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { IResponse } from '../../../../globalTypes/iResponce';

const prisma = new PrismaClient();

export const addClientMailTel = async (req: Request, res: Response, next: NextFunction) => {
    const { emails, phones } = req.body;
    const client_id = req.body.client_id;

    try {
        // Debugging: Check if prisma is correctly initialized
        if (!prisma) {
            throw new Error('Prisma client is not initialized');
        }

        // Check client_id validity
        const clientId = parseInt(client_id, 10);
        if (isNaN(clientId)) {
            return res.status(400).json({ error: 'Invalid client_id parameter' });
        }

        // Check if the client exists
        const existingClient = await prisma.clients.findUnique({
            where: { client_id: clientId }
        });

        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Check if prisma.ClientEmails and prisma.ClientPhones are correctly defined
        if (!prisma.clientEmails || !prisma.clientPhones) {
            throw new Error('Prisma ClientEmails or ClientPhones are not defined');
        }

        // Sprawdź istniejące e-maile
        const existingEmails = await prisma.clientEmails.findMany({
            where: { client_id: clientId }
        });
        const existingEmailSet = new Set(existingEmails.map((e: { email: string }) => e.email));

        // Dodawanie e-maili
        if (emails && emails.length > 0) {
            for (const email of emails) {
                if (!existingEmailSet.has(email)) {
                    await prisma.clientEmails.create({
                        data: {
                            client_id: clientId,
                            email: email
                        }
                    });
                }
            }
        }

        // Sprawdź istniejące telefony
        const existingPhones = await prisma.clientPhones.findMany({
            where: { client_id: clientId }
        });
        const existingPhoneSet = new Set(existingPhones.map((p: { tel_number: string }) => p.tel_number));

        // Dodawanie numerów telefonów
        if (phones && phones.length > 0) {
            for (const phone of phones) {
                if (!existingPhoneSet.has(phone)) {
                    await prisma.clientPhones.create({
                        data: {
                            client_id: clientId,
                            tel_number: phone
                        }
                    });
                }
            }
        }

        next();

    } catch (error) {
        const response: IResponse = {
            status: 'error',
            display: true,
            error: { error },
            message: 'Błąd dodawania kontaktów nowego klienta',
            devmessage: `${error}`,
            data: null
        };

        res.status(500).json(response);
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