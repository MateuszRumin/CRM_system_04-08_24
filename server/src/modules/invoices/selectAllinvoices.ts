import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoices = await prisma.invoices.findMany({
      select: {
        invoice_number: true,
        issue_date: true,
        due_date: true,
        prize_netto: true,
        tax_ammount: true,
        //note: true,
        Client: {
          select: {
            first_name: true,
            second_name: true,
            company_name: true
          }
        },
        InvoiceType: {
          select: {
            invoice_type: true
          }
        },
        Status: {
          select: {
            name: true
          }
        }
      }
    });

    const formattedInvoices = invoices.map(invoice => ({
      invoice_number: invoice.invoice_number,
      client_name: `${invoice.Client.first_name} ${invoice.Client.second_name} (${invoice.Client.company_name})`,
      invoice_type: invoice.InvoiceType.invoice_type,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      prize_brutto: invoice.tax_ammount + invoice.tax_ammount,
      status: invoice.Status.name,
      //note: invoice.note
    }));

    res.json(formattedInvoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
