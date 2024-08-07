import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


exports.deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoiceId = req.body.main.invoice_id;
  
      // Pobranie faktury z bazy danych
      const invoice = await prisma.invoices.findUnique({
        where: { invoice_id: invoiceId },
        include: { Status: true }  // Pobranie powiązanego statusu
      });
  
      // Sprawdzenie, czy faktura istnieje
      if (!invoice) {
        return res.status(404).json({
          status: 'error',
          display: true,
          error: null,
          message: 'Faktura nie istnieje',
          devmessage: 'Invoice not found',
          data: null,
        });
      }
  
      // Sprawdzenie, czy faktura jest zablokowana lub ma status 'Wystawiona'
      if (invoice.block || invoice.Status.name === 'Wystawiona') {
        return res.status(400).json({
          status: 'error',
          display: true,
          error: null,
          message: 'Nie można usunąć zablokowanej lub wystawionej faktury',
          devmessage: 'Cannot delete blocked or issued invoice',
          data: null,
        });
      }
  
      // Usunięcie powiązanych rekordów w InvoiceProducts
      await prisma.invoiceProducts.deleteMany({
        where: { invoice_id: invoiceId },
      });
  
      // Usunięcie faktury
      await prisma.invoices.delete({
        where: { invoice_id: invoiceId },
      });
  
      const response: IResponse = {
        status: 'success',
        display: true,
        error: null,
        message: 'Faktura usunięta',
        devmessage: 'Invoice deleted',
        data: null,
      };
  
      res.status(200).json(response);
  
    } catch (error) {
      console.error('Błąd usuwania faktury:', error);
      const response: IResponse = {
        status: 'error',
        display: true,
        error: { error },
        message: 'Błąd usuwania faktury',
        devmessage: `${error}`,
        data: null,
      };
  
      res.status(500).json(response);
    }
};