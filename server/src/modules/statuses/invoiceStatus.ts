import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const selectInvoiceStatuses = async (req: Request, res: Response) => {
    try {
        const invoiceStatuses = await prisma.statuses.findMany({
            where: {
                status_type: 'Faktura'
            }
        });
        res.status(200).json(invoiceStatuses);
    } catch (error) {
        console.error('Error fetching invoice statuses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateInvoiceStatus = async (req: Request, res: Response) => {
    const { invoice_id, status_id } = req.params;

    try {
        // Sprawdzenie czy status istnieje
        const statusExists = await prisma.statuses.findUnique({
            where: { status_id: parseInt(status_id, 10) }
        });

        if (!statusExists) {
            return res.status(400).json({ error: 'Status not found' });
        }

        const updatedInvoice = await prisma.invoices.update({
            where: { invoice_id: parseInt(invoice_id, 10) },
            data: { status_id: parseInt(status_id, 10) }
        });

        res.status(200).json(updatedInvoice);
    } catch (error) {
        console.error('Error updating invoice status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};