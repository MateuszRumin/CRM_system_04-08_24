import { Request, Response, NextFunction } from 'express';
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
        await prisma.clientEmails.deleteMany({ where: { client_id: id } });
        await prisma.clientPhones.deleteMany({ where: { client_id: id } });

        let emailErrors = [];
        if (emails && emails.length > 0) {
            for (const email of emails) {
                try {
                    await prisma.clientEmails.create({
                        data: {
                            client_id: id,
                            email: email,
                        },
                    });
                } catch (e) {
                    emailErrors.push(email);
                }
            }
        }

        let phoneErrors = [];
        if (phones && phones.length > 0) {
            for (const phone of phones) {
                try {
                    await prisma.clientPhones.create({
                        data: {
                            client_id: id,
                            tel_number: phone,
                        },
                    });
                } catch (e) {
                    phoneErrors.push(phone);
                }
            }
        }

        const updatedClientWithContacts = await prisma.clients.findUnique({
            where: { client_id: id },
            include: {
                ClientEmail: true,
                ClientPhone: true,
            },
        });

        if (emailErrors.length === 0 && phoneErrors.length === 0) {
            res.status(200).json({
                message: 'Client data updated successfully',
                data: updatedClientWithContacts
            });
        } else {
            res.status(200).json({
                message: 'Client data updated successfully with some errors',
                data: updatedClientWithContacts,
                emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
                phoneErrors: phoneErrors.length > 0 ? phoneErrors : undefined,
            });
        }
    } catch (error) {
        console.error('Error updating client with contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};