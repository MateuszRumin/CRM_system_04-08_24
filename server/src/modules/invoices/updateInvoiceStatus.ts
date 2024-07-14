import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateInvoiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { invoice_id, status_id } = req.body;

    // Sprawdzenie czy faktura istnieje
    const invoice = await prisma.invoices.findUnique({
      where: { invoice_id }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Aktualizacja statusu faktury
    const updatedInvoice = await prisma.invoices.update({
      where: { invoice_id },
      data: { status_id }
    });

    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};