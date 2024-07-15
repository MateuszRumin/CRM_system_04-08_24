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
        emails,
        phones
    } = req.body;

    try {
        const id = parseInt(client_id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid client_id parameter' });
        }

        // Sprawdzanie, czy klient istnieje
        const existingClient = await prisma.clients.findUnique({ where: { client_id: id } });
        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Aktualizowanie danych klienta
        const updatedClient = await prisma.clients.update({
            where: { client_id: id },
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
        await prisma.clientEmails.deleteMany({ where: { client_id: id } });
        await prisma.clientPhones.deleteMany({ where: { client_id: id } });

        // Aktualizacja e-maili
        let emailErrors = [];
        let successfulEmails = [];
        if (emails && emails.length > 0) {
            for (const email of emails) {
                try {
                    await prisma.clientEmails.create({
                        data: {
                            client_id: id,
                            email: email,
                        },
                    });
                    successfulEmails.push(email);
                } catch (e) {
                    emailErrors.push(email);
                }
            }
        }

        // Aktualizacja numerów telefonów
        let phoneErrors = [];
        let successfulPhones = [];
        if (phones && phones.length > 0) {
            for (const phone of phones) {
                try {
                    await prisma.clientPhones.create({
                        data: {
                            client_id: id,
                            tel_number: phone,
                        },
                    });
                    successfulPhones.push(phone);
                } catch (e) {
                    phoneErrors.push(phone);
                }
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

        let responseMessage = 'Client data updated successfully';
        if (emailErrors.length > 0 || phoneErrors.length > 0) {
            responseMessage += ' with some errors';
        }

        res.status(200).json({
            message: responseMessage,
            data: updatedClientWithContacts,
            successfulEmails: successfulEmails.length > 0 ? successfulEmails : undefined,
            emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
            successfulPhones: successfulPhones.length > 0 ? successfulPhones : undefined,
            phoneErrors: phoneErrors.length > 0 ? phoneErrors : undefined,
        });
    } catch (error) {
        console.error('Error updating client with contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};