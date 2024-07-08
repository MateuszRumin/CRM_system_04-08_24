import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateAllSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        // Invoice settings
        current_number_year,
        current_number_month,
        current_number_sequence,
        default_currency,
        template,
        payment_term,
        vat_enabled,
        advance_enabled,
        final_enabled,
        proforma_enabled,
        periodic_enabled,
        periodic_auto_generate,
        periodic_frequency,
        reminder_enabled,
        reminder_frequency,
        reminder_content,
        reminder_channel_email,
        reminder_channel_sms,
        reminder_channel_push,
        company_id,
        // Company settings
        nip,
        regon,
        krs,
        name,
        address,
        // Invoice payment settings
        advancement_rate,
        tax_rate,
        tax_type,
        default_vat_amount
      } = req.body;
  
      // Pobranie ustawień faktur dla danej firmy
      const invoiceSetting = await prisma.invoiceSettings.findFirst({
        where: { company_id }
      });
  
      if (!invoiceSetting) {
        return res.status(404).json({ error: 'Invoice settings not found for the specified company' });
      }
  
      // Pobranie ustawień płatności faktur dla danej firmy
      const invoicePaymentSetting = await prisma.invoicePaymentSettings.findFirst({
        where: { company_id }
      });
  
      if (!invoicePaymentSetting) {
        return res.status(404).json({ error: 'Invoice payment settings not found for the specified company' });
      }
  
      // Aktualizacja ustawień faktur
      const updatedInvoiceSettings = await prisma.invoiceSettings.update({
        where: { invoice_setting_id: invoiceSetting.invoice_setting_id },
        data: {
          current_number_year,
          current_number_month,
          current_number_sequence,
          default_currency,
          template,
          payment_term,
          vat_enabled,
          advance_enabled,
          final_enabled,
          proforma_enabled,
          periodic_enabled,
          periodic_auto_generate,
          periodic_frequency,
          reminder_enabled,
          reminder_frequency,
          reminder_content,
          reminder_channel_email,
          reminder_channel_sms,
          reminder_channel_push
        }
      });
  
      // Aktualizacja danych firmy
      const updatedCompany = await prisma.companies.update({
        where: { company_id },
        data: {
          nip,
          regon,
          krs,
          name,
          address
        }
      });
  
      // Aktualizacja ustawień płatności faktur
      const updatedInvoicePaymentSettings = await prisma.invoicePaymentSettings.update({
        where: { payment_setting_id: invoicePaymentSetting.payment_setting_id },
        data: {
          advancement_rate,
          tax_rate,
          tax_type,
          default_vat_amount
        }
      });
  
      res.status(200).json({
        invoiceSettings: updatedInvoiceSettings,
        company: updatedCompany,
        invoicePaymentSettings: updatedInvoicePaymentSettings
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
};