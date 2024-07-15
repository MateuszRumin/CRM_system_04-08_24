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
      default_vat_amount,
      // Invoice types (notification settings)
      invoice_type_id,
      email_notification,
      sms_notification,
      push_notification,
      unpaid_reminder_enabled,
      reminder_frequency,
      reminder_content
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

    // Pobranie typu faktury (dla ustawień powiadomień)
    const invoiceType = await prisma.invoiceTypes.findFirst({
      where: { invoice_type_id }
    });

    if (!invoiceType) {
      return res.status(404).json({ error: 'Invoice type not found' });
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
        periodic_frequency
        // Usunięto pola dotyczące przypomnień
      }
    });

    // Aktualizacja danych firmy
    const updatedCompany = await prisma.companySettings.update({
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

    // Aktualizacja typu faktury (dla ustawień powiadomień)
    const updatedInvoiceType = await prisma.invoiceTypes.update({
      where: { invoice_type_id: invoiceType.invoice_type_id },
      data: {
        email_notification,
        sms_notification,
        push_notification,
        unpaid_reminder_enabled,
        reminder_frequency,
        reminder_content
      }
    });

    res.status(200).json({
      invoiceSettings: updatedInvoiceSettings,
      company: updatedCompany,
      invoicePaymentSettings: updatedInvoicePaymentSettings,
      invoiceType: updatedInvoiceType
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};