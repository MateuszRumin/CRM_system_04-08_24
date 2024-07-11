import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { IResponse } from '../../../../globalTypes/iResponce';

const prisma = new PrismaClient();

export const updateClientData = async (req: Request, res: Response) => {
    const { client_id } = req.params;
    const {
        status_id,
        user_id,
        client_type,
        first_name,
        second_name,
        regon,
        nip,
        krs,
        company_name,
        address,
        emails,
        phones
    } = req.body;

    try {
        const id = parseInt(client_id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid clientId parameter' });
        }

        // Aktualizujemy dane klienta
        const updatedClient = await prisma.clients.update({
            where: {
                client_id: id,
            },
            data: {
                status_id,
                user_id,
                client_type,
                first_name,
                second_name,
                regon,
                nip,
                krs,
                company_name,
                address,
            },
        });

        // Usunięcie istniejących e-maili i numerów telefonów
        await prisma.clientEmails.deleteMany({
            where: { client_id: id },
        });
        await prisma.clientPhones.deleteMany({
            where: { client_id: id },
        });

        if (emails && emails.length > 0) {
            for (const email of emails) {
                await prisma.clientEmails.create({
                    data: {
                        client_id: id,
                        email: email,
                    },
                });
            }
        }

        if (phones && phones.length > 0) {
            for (const phone of phones) {
                await prisma.clientPhones.create({
                    data: {
                        client_id: id,
                        tel_number: phone,
                    },
                });
            }
        }

        // Pobranie zaktualizowanych danych klienta razem z e-mailami i numerami telefonów
        const updatedClientWithContacts = await prisma.clients.findUnique({
            where: { client_id: id },
            include: {
                ClientEmail: true,
                ClientPhone: true,
            },
        });

        res.status(200).json(updatedClientWithContacts);
    } catch (error) {
        console.error('Error updating client with contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};