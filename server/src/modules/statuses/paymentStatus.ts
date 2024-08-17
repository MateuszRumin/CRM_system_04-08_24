import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const selectPaymentStatuses = async (req: Request, res: Response) => {
    try {
        const paymentStatuses = await prisma.statuses.findMany({
            where: {
                status_type: 'Platnosc'
            }
        });
        res.status(200).json(paymentStatuses);
    } catch (error) {
        console.error('Error fetching payment statuses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
    const { payment_id, status_id } = req.params;

    try {
        // Sprawdzenie czy status istnieje
        const statusExists = await prisma.statuses.findUnique({
            where: { status_id: parseInt(status_id, 10) }
        });

        if (!statusExists) {
            return res.status(400).json({ error: 'Status not found' });
        }

        const updatedPayment = await prisma.invoicePayments.update({
            where: { payment_id: parseInt(payment_id, 10) },
            data: { status_id: parseInt(status_id, 10) }
        });

        res.status(200).json(updatedPayment);
    } catch (error) {
        console.error('Error updating invoice payment status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};