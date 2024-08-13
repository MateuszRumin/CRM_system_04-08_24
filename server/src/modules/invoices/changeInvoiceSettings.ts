import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateAllSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
  
      // Update or Insert InvoiceTypes
      if (data.invoiceTypes) {
        for (const type of data.invoiceTypes) {
          const existingType = await prisma.invoiceTypes.findUnique({
            where: { invoice_type_id: type.invoice_type_id },
          });
  
          if (existingType) {
            // Update existing record
            await prisma.invoiceTypes.update({
              where: { invoice_type_id: type.invoice_type_id },
              data: {
                invoice_type: type.invoice_type !== undefined ? type.invoice_type : existingType.invoice_type,
                marker_id: type.marker_id !== undefined ? type.marker_id : existingType.marker_id,
                enabled: type.enabled !== undefined ? type.enabled : existingType.enabled,
              },
            });
          } else {
            // Insert new record
            await prisma.invoiceTypes.create({
              data: {
                invoice_type_id: type.invoice_type_id, // Zakładając, że używasz ID jako auto-generated, może być potrzebna modyfikacja
                invoice_type: type.invoice_type,
                marker_id: type.marker_id,
                enabled: type.enabled,
              },
            });
          }
        }
      }
  
      // Update or Insert CompanySettings
      if (data.companySettings) {
        const existingCompanySettings = await prisma.companySettings.findUnique({
          where: { company_id: data.companySettings.company_id },
        });
  
        if (existingCompanySettings) {
          // Update existing record
          await prisma.companySettings.update({
            where: { company_id: data.companySettings.company_id },
            data: {
              name: data.companySettings.name !== undefined ? data.companySettings.name : existingCompanySettings.name,
              address: data.companySettings.address !== undefined ? data.companySettings.address : existingCompanySettings.address,
              regon: data.companySettings.regon !== undefined ? data.companySettings.regon : existingCompanySettings.regon,
              nip: data.companySettings.nip !== undefined ? data.companySettings.nip : existingCompanySettings.nip,
              krs: data.companySettings.krs !== undefined ? data.companySettings.krs : existingCompanySettings.krs,
            },
          });
        } else {
          // Insert new record
          await prisma.companySettings.create({
            data: {
              company_id: 1, // Assuming company_id is always 1. Adjust as needed.
              name: data.companySettings.name,
              address: data.companySettings.address,
              regon: data.companySettings.regon,
              nip: data.companySettings.nip,
              krs: data.companySettings.krs,
            },
          });
        }
      }
  
      // Update or Insert InvoiceSettings
      if (data.invoiceSettings) {
        const existingInvoiceSettings = await prisma.invoiceSettings.findUnique({
          where: { invoice_setting_id: data.invoiceSettings.invoice_setting_id },
        });
  
        if (existingInvoiceSettings) {
          // Update existing record
          await prisma.invoiceSettings.update({
            where: { invoice_setting_id: data.invoiceSettings.invoice_setting_id },
            data: {
              default_currency: data.invoiceSettings.default_currency !== undefined ? data.invoiceSettings.default_currency : existingInvoiceSettings.default_currency,
              payment_term: data.invoiceSettings.payment_term !== undefined ? data.invoiceSettings.payment_term : existingInvoiceSettings.payment_term,
              periodic_auto_generate: data.invoiceSettings.periodic_auto_generate !== undefined ? data.invoiceSettings.periodic_auto_generate : existingInvoiceSettings.periodic_auto_generate,
              periodic_frequency: data.invoiceSettings.periodic_frequency !== undefined ? data.invoiceSettings.periodic_frequency : existingInvoiceSettings.periodic_frequency,
              email_notification: data.invoiceSettings.email_notification !== undefined ? data.invoiceSettings.email_notification : existingInvoiceSettings.email_notification,
              sms_notification: data.invoiceSettings.sms_notification !== undefined ? data.invoiceSettings.sms_notification : existingInvoiceSettings.sms_notification,
              push_notification: data.invoiceSettings.push_notification !== undefined ? data.invoiceSettings.push_notification : existingInvoiceSettings.push_notification,
              unpaid_reminder_enabled: data.invoiceSettings.unpaid_reminder_enabled !== undefined ? data.invoiceSettings.unpaid_reminder_enabled : existingInvoiceSettings.unpaid_reminder_enabled,
              reminder_frequency: data.invoiceSettings.reminder_frequency !== undefined ? data.invoiceSettings.reminder_frequency : existingInvoiceSettings.reminder_frequency,
              reminder_content: data.invoiceSettings.reminder_content !== undefined ? data.invoiceSettings.reminder_content : existingInvoiceSettings.reminder_content,
            },
          });
        } else {
          // Insert new record
          await prisma.invoiceSettings.create({
            data: {
              invoice_setting_id: 1, // Assuming invoice_setting_id is always 1. Adjust as needed.
              default_currency: data.invoiceSettings.default_currency,
              payment_term: data.invoiceSettings.payment_term,
              periodic_auto_generate: data.invoiceSettings.periodic_auto_generate,
              periodic_frequency: data.invoiceSettings.periodic_frequency,
              email_notification: data.invoiceSettings.email_notification,
              sms_notification: data.invoiceSettings.sms_notification,
              push_notification: data.invoiceSettings.push_notification,
              unpaid_reminder_enabled: data.invoiceSettings.unpaid_reminder_enabled,
              reminder_frequency: data.invoiceSettings.reminder_frequency,
              reminder_content: data.invoiceSettings.reminder_content,
            },
          });
        }
      }
  
      // Update or Insert InvoicePaymentSettings
      if (data.invoicePaymentSettings) {
        const existingInvoicePaymentSettings = await prisma.invoicePaymentSettings.findUnique({
          where: { payment_setting_id: data.invoicePaymentSettings.payment_setting_id },
        });
  
        if (existingInvoicePaymentSettings) {
          // Update existing record
          await prisma.invoicePaymentSettings.update({
            where: { payment_setting_id: data.invoicePaymentSettings.payment_setting_id },
            data: {
              advancement_rate: data.invoicePaymentSettings.advancement_rate !== undefined ? data.invoicePaymentSettings.advancement_rate : existingInvoicePaymentSettings.advancement_rate,
              tax_rate: data.invoicePaymentSettings.tax_rate !== undefined ? data.invoicePaymentSettings.tax_rate : existingInvoicePaymentSettings.tax_rate,
              tax_type: data.invoicePaymentSettings.tax_type !== undefined ? data.invoicePaymentSettings.tax_type : existingInvoicePaymentSettings.tax_type,
              default_vat_amount: data.invoicePaymentSettings.default_vat_amount !== undefined ? data.invoicePaymentSettings.default_vat_amount : existingInvoicePaymentSettings.default_vat_amount,
              // company_id: data.invoicePaymentSettings.company_id !== undefined ? data.invoicePaymentSettings.company_id : existingInvoicePaymentSettings.company_id,
            },
          });
        } else {
          // Insert new record
          await prisma.invoicePaymentSettings.create({
            data: {
              payment_setting_id: 1, // Assuming payment_setting_id is always 1. Adjust as needed.
              advancement_rate: data.invoicePaymentSettings.advancement_rate,
              tax_rate: data.invoicePaymentSettings.tax_rate,
              tax_type: data.invoicePaymentSettings.tax_type,
              default_vat_amount: data.invoicePaymentSettings.default_vat_amount,
              // company_id: data.invoicePaymentSettings.company_id,
            },
          });
        }
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Settings updated or inserted successfully',
      });
    } catch (error) {
      console.error('Error updating or inserting settings', error);
  
      res.status(500).json({
        status: 'error',
        message: 'Error updating or inserting settings',
        error: error,
      });
    }
};