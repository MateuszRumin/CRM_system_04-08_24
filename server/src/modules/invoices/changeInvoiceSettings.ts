import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateAllSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      // Invoice settings
      default_currency,
      payment_term,
      periodic_auto_generate,
      periodic_frequency,
      email_notification,
      sms_notification,
      push_notification,
      unpaid_reminder_enabled,
      reminder_frequency,
      reminder_content,
      // Company settings
      company_id,
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
      invoice_type,
      numbering_format,
      enabled,
      current_number_sequence,
      template
    } = req.body;

    const changedTables: string[] = [];

    if (company_id) {
      // Jeśli obecne są dane ustawień faktur, aktualizuj lub twórz ustawienia faktur
      if (
        default_currency !== undefined ||
        payment_term !== undefined ||
        periodic_auto_generate !== undefined ||
        periodic_frequency !== undefined ||
        email_notification !== undefined ||
        sms_notification !== undefined ||
        push_notification !== undefined ||
        unpaid_reminder_enabled !== undefined ||
        reminder_frequency !== undefined ||
        reminder_content !== undefined
      ) {
        let invoiceSetting = await prisma.invoiceSettings.findFirst({
          where: { company_id }
        });

        if (!invoiceSetting) {
          invoiceSetting = await prisma.invoiceSettings.create({
            data: {
              company_id,
              default_currency,
              payment_term,
              periodic_auto_generate,
              periodic_frequency,
              email_notification,
              sms_notification,
              push_notification,
              unpaid_reminder_enabled,
              reminder_frequency,
              reminder_content
            }
          });
          changedTables.push('invoiceSettings');
        } else {
          await prisma.invoiceSettings.update({
            where: { invoice_setting_id: invoiceSetting.invoice_setting_id },
            data: {
              default_currency,
              payment_term,
              periodic_auto_generate,
              periodic_frequency,
              email_notification,
              sms_notification,
              push_notification,
              unpaid_reminder_enabled,
              reminder_frequency,
              reminder_content
            }
          });
          changedTables.push('invoiceSettings');
        }
      }

      // Jeśli obecne są dane ustawień płatności faktur, aktualizuj lub twórz ustawienia płatności faktur
      if (
        advancement_rate !== undefined ||
        tax_rate !== undefined ||
        tax_type !== undefined ||
        default_vat_amount !== undefined
      ) {
        let invoicePaymentSetting = await prisma.invoicePaymentSettings.findFirst({
          where: { company_id }
        });

        if (!invoicePaymentSetting) {
          invoicePaymentSetting = await prisma.invoicePaymentSettings.create({
            data: {
              company_id,
              advancement_rate,
              tax_rate,
              tax_type,
              default_vat_amount
            }
          });
          changedTables.push('invoicePaymentSettings');
        } else {
          await prisma.invoicePaymentSettings.update({
            where: { payment_setting_id: invoicePaymentSetting.payment_setting_id },
            data: {
              advancement_rate,
              tax_rate,
              tax_type,
              default_vat_amount
            }
          });
          changedTables.push('invoicePaymentSettings');
        }
      }

      // Jeśli obecne są dane ustawień firmy, aktualizuj lub twórz ustawienia firmy
      if (
        nip !== undefined ||
        regon !== undefined ||
        krs !== undefined ||
        name !== undefined ||
        address !== undefined
      ) {
        await prisma.companySettings.upsert({
          where: { company_id },
          update: {
            nip,
            regon,
            krs,
            name,
            address
          },
          create: {
            company_id,
            nip,
            regon,
            krs,
            name,
            address
          }
        });
        changedTables.push('companySettings');
      }
    }

    // Jeśli obecne są dane typu faktury, aktualizuj lub twórz typ faktury
    if (
      invoice_type_id !== undefined ||
      invoice_type !== undefined ||
      numbering_format !== undefined ||
      enabled !== undefined ||
      current_number_sequence !== undefined ||
      template !== undefined
    ) {
      let invoiceType = await prisma.invoiceTypes.findFirst({
        where: { invoice_type_id }
      });

      if (!invoiceType) {
        invoiceType = await prisma.invoiceTypes.create({
          data: {
            invoice_type_id,
            invoice_type,
            numbering_format,
            enabled,
            current_number_sequence,
            template
          }
        });
        changedTables.push('invoiceTypes');
      } else {
        await prisma.invoiceTypes.update({
          where: { invoice_type_id: invoiceType.invoice_type_id },
          data: {
            invoice_type,
            numbering_format,
            enabled,
            current_number_sequence,
            template
          }
        });
        changedTables.push('invoiceTypes');
      }
    }

    res.status(200).json({
      message: `Settings updated successfully. Tables changed: ${changedTables.join(', ')}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};