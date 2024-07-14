import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClientById = async (req: Request, res: Response) => {
    const { client_id } = req.params;

    try {
        const id = parseInt(client_id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid client_id parameter' });
        }

        // Pobieramy dane klienta wraz ze wszystkimi powiązanymi danymi
        const client = await prisma.clients.findUnique({
            where: { client_id: id },
            include: {
                Status: true,
                User: true,
                ClientNote: {
                    include: {
                        Note: true
                    }
                },
                ClientTask: {
                    include: {
                        Task: true
                    }
                },
                //ClientContact: true,
                Invoice: {
                    include: {
                        InvoiceType: true,
                        // Project: true,
                        Status: true
                    }
                },
                ClientEmail: true,
                ClientPhone: true
            }
        });

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.status(200).json(client);
    } catch (error) {
        console.error('Error fetching client by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};