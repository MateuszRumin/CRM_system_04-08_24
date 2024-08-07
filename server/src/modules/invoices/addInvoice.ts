import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../../globalTypes/iResponce';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


exports.addInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Miesiące są indeksowane od 0
  
      // Pobranie typu faktury z danych wejściowych
      const invoiceTypeId = req.body.main.invoice_type_id;
  
      // Pobranie danych o typie faktury
      const invoiceType = await prisma.invoiceTypes.findUnique({
        where: { invoice_type_id: invoiceTypeId },
      });
  
      if (!invoiceType) {
        throw new Error('Invoice type not found');
      }
  
      // Pobranie aktualnych ustawień numeracji z tabeli Markers na podstawie marker_id typu faktury
      const marker = await prisma.markers.findUnique({
        where: { marker_id: invoiceType.marker_id },
      });
  
      if (!marker) {
        throw new Error('Markers not found');
      }
  
      // Sprawdzenie, czy miesiąc się zmienił
      if (currentMonth !== marker.current_month_sequence) {
        // Zresetowanie numeru faktury, jeśli miesiąc się zmienił
        await prisma.markers.update({
          where: { marker_id: marker.marker_id },
          data: {
            current_month_sequence: currentMonth,
            current_year_sequence: currentYear,
            current_number_sequence: 1, // Reset numeru faktury
          },
        });
      } else {
        // Inkrementowanie numeru faktury
        await prisma.markers.update({
          where: { marker_id: marker.marker_id },
          data: {
            current_number_sequence: marker.current_number_sequence + 1,
          },
        });
      }
  
      // Pobranie zaktualizowanego numeru faktury
      const updatedMarker = await prisma.markers.findUnique({
        where: { marker_id: invoiceType.marker_id },
      });
  
      if (!updatedMarker) {
        throw new Error('Updated markers not found');
      }
  
      // Dodanie nowej faktury
      const invoice = await prisma.invoices.create({
        data: {
          year: currentYear,
          month: currentMonth,
          invoice_number: `${currentYear}/${currentMonth}/${updatedMarker.current_number_sequence}`,
          status_id: req.body.main.status_id,
          invoice_type_id: invoiceTypeId,
          client_id: req.body.client.client_id,
          issue_date: new Date(),
          due_date: req.body.main.due_date, // Można dostosować
          prize_netto: req.body.summary.prize_netto,
          prize_brutto: req.body.summary.prize_brutto,
          tax_ammount: req.body.summary.tax_ammount,
          comments: req.body.summary.comments,
        },
      });
  
      res.status(201).json({
        status: 'success',
        message: 'Invoice added successfully',
        data: invoice,
      });
    } catch (error) {
      console.error('Error adding invoice:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to add invoice',
        error: error
      });
    }
};

exports.updateInvoice = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = req.app.get('prisma');

  try {
      const { main, client, summary } = req.body;

      // Validate invoice_id
      if (!main || !main.invoice_id) {
          return res.status(400).json({
              status: 'error',
              message: 'invoice_id is required',
          });
      }

      // Initialize updateData object
      let updateData: any = {};

      // Update main details
      if (main) {
          updateData = {
              ...updateData,
              ...{
                  status_id: main.status_id,
                  invoice_type_id: main.invoice_type_id,
              },
          };
      }

      // Update client details
      if (client) {
          // Here you may want to validate that client_id is provided and is a valid integer
          updateData.client_id = client.client_id;
      }

      // Update summary details
      if (summary) {
          updateData = {
              ...updateData,
              ...{
                  prize_netto: summary.prize_netto,
                  prize_brutto: summary.prize_brutto,
                  tax_ammount: summary.tax_ammount,
                  comments: summary.comments,
              },
          };
      }

      // Perform update on Invoices table
      const updatedInvoice = await prisma.Invoices.update({
          where: { invoice_id: main.invoice_id },
          data: updateData,
      });

      // Response with updated invoice data
      res.status(200).json({
          status: 'success',
          message: 'Invoice updated successfully',
          data: updatedInvoice,
      });
  } catch (error) {
      console.error('Error updating invoice', error);

      res.status(500).json({
          status: 'error',
          message: 'Error updating invoice',
          error: error
      });
  }
};