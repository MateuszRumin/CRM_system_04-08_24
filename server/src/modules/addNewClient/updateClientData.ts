import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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
        contacts
    } = req.body.client; // Zmieniłem sposób pobierania danych klienta

    try {
        // Sprawdzamy, czy clientId jest liczbą
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

        // Usuwamy istniejące dane kontaktowe, jeśli są
        await prisma.clientContacts.deleteMany({
            where: {
                client_id: id,
            },
        });

        // Dodajemy nowe dane kontaktowe
        if (contacts && Array.isArray(contacts)) {
            await Promise.all(
                contacts.map(contact =>
                    prisma.clientContacts.create({
                        data: {
                            client_id: id,
                            email: contact.email || 'Brak',
                            tel_number: contact.tel_number || 'Brak',
                        },
                    })
                )
            );
        }

        // Pobieramy zaktualizowane dane klienta razem z nowymi kontaktami
        const updatedClientWithContacts = await prisma.clients.findUnique({
            where: {
                client_id: id,
            },
            include: {
                ClientContact: true,
            },
        });

        res.status(200).json(updatedClientWithContacts);
    } catch (error) {
        console.error('Error updating client with contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
