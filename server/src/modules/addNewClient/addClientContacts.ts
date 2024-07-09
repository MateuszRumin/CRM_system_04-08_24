import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addClientMailTel = async (req: Request, res: Response) => {
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

        // Dodawanie e-maili
        // if (emails && emails.length > 0) {
        //     for (const email of emails) {
        //         await prisma.clientEmails.create({
        //             data: {
        //                 client_id: clientId,
        //                 email: email
        //             }
        //         });
        //     }
        // }

        // Dodawanie numerów telefonów
        // if (phones && phones.length > 0) {
        //     for (const phone of phones) {
        //         await prisma.clientPhones.create({
        //             data: {
        //                 client_id: clientId,
        //                 tel_number: phone
        //             }
        //         });
        //     }
        // }

        res.status(201).json({ message: 'Contacts added successfully' });
    } catch (error) {
        console.error('Error adding contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const addClientContact = async (req: Request, res: Response) => {
    const { client_id } = req.params;
    const { emails, phones, first_name, second_name } = req.body;

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

        // Dodawanie e-maili, jeśli są przekazane
        if (emails && Array.isArray(emails)) {
            for (const email of emails) {
                await prisma.clientContacts.create({
                    data: {
                        client_id: clientId,
                        email: email,
                        //tel_number: 'Brak'
                    }
                });
            }
        }

        // Dodawanie numerów telefonów, jeśli są przekazane
        if (phones && Array.isArray(phones)) {
            for (const phone of phones) {
                await prisma.clientContacts.create({
                    data: {
                        client_id: clientId,
                        tel_number: phone,
                        //email: 'Brak'
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