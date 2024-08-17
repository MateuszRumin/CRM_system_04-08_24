import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInvoiceDetails = async (req: Request, res: Response) => {
  const { invoice_id } = req.params;

  try {
    // Pobranie szczegółów faktury
    const invoice = await prisma.invoices.findUnique({
      where: { invoice_id: Number(invoice_id) },
      include: {
        InvoiceType: true, 
        Status: true,         
        Client: true,            
        InvoiceProduct: {       
          include: {
            Project: true       
          }
        },
        InvoicePayment: {
          include: {
            Status:true,
          }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};