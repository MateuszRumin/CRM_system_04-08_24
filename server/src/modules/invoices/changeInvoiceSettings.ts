import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateAllSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const data = req.body;

      // Update InvoiceTypes
      if (data.invoiceTypes) {
          for (const type of data.invoiceTypes) {
              await prisma.invoiceTypes.update({
                  where: { invoice_type_id: type.invoice_type_id },
                  data: {
                      invoice_type: type.invoice_type !== undefined ? type.invoice_type : undefined,
                      marker_id: type.marker_id !== undefined ? type.marker_id : undefined,
                      enabled: type.enabled !== undefined ? type.enabled : undefined,
                  },
              });
          }
      }

      // Update CompanySettings
      if (data.companySettings) {
          await prisma.companySettings.update({
              where: { company_id: data.companySettings.company_id },
              data: {
                  name: data.companySettings.name !== undefined ? data.companySettings.name : undefined,
                  address: data.companySettings.address !== undefined ? data.companySettings.address : undefined,
                  regon: data.companySettings.regon !== undefined ? data.companySettings.regon : undefined,
                  nip: data.companySettings.nip !== undefined ? data.companySettings.nip : undefined,
                  krs: data.companySettings.krs !== undefined ? data.companySettings.krs : undefined,
              },
          });
      }

      // Update InvoiceSettings
      if (data.invoiceSettings) {
          await prisma.invoiceSettings.update({
              where: { invoice_setting_id: data.invoiceSettings.invoice_setting_id },
              data: {
                  default_currency: data.invoiceSettings.default_currency !== undefined ? data.invoiceSettings.default_currency : undefined,
                  payment_term: data.invoiceSettings.payment_term !== undefined ? data.invoiceSettings.payment_term : undefined,
                  periodic_auto_generate: data.invoiceSettings.periodic_auto_generate !== undefined ? data.invoiceSettings.periodic_auto_generate : undefined,
                  periodic_frequency: data.invoiceSettings.periodic_frequency !== undefined ? data.invoiceSettings.periodic_frequency : undefined,
                  email_notification: data.invoiceSettings.email_notification !== undefined ? data.invoiceSettings.email_notification : undefined,
                  sms_notification: data.invoiceSettings.sms_notification !== undefined ? data.invoiceSettings.sms_notification : undefined,
                  push_notification: data.invoiceSettings.push_notification !== undefined ? data.invoiceSettings.push_notification : undefined,
                  unpaid_reminder_enabled: data.invoiceSettings.unpaid_reminder_enabled !== undefined ? data.invoiceSettings.unpaid_reminder_enabled : undefined,
                  reminder_frequency: data.invoiceSettings.reminder_frequency !== undefined ? data.invoiceSettings.reminder_frequency : undefined,
                  reminder_content: data.invoiceSettings.reminder_content !== undefined ? data.invoiceSettings.reminder_content : undefined,
              },
          });
      }

      // Update InvoicePaymentSettings
      if (data.invoicePaymentSettings) {
          await prisma.invoicePaymentSettings.update({
              where: { payment_setting_id: data.invoicePaymentSettings.payment_setting_id },
              data: {
                  advancement_rate: data.invoicePaymentSettings.advancement_rate !== undefined ? data.invoicePaymentSettings.advancement_rate : undefined,
                  tax_rate: data.invoicePaymentSettings.tax_rate !== undefined ? data.invoicePaymentSettings.tax_rate : undefined,
                  tax_type: data.invoicePaymentSettings.tax_type !== undefined ? data.invoicePaymentSettings.tax_type : undefined,
                  default_vat_amount: data.invoicePaymentSettings.default_vat_amount !== undefined ? data.invoicePaymentSettings.default_vat_amount : undefined,
                  company_id: data.invoicePaymentSettings.company_id !== undefined ? data.invoicePaymentSettings.company_id : undefined,
              },
          });
      }

      res.status(200).json({
          status: 'success',
          message: 'Settings updated successfully',
      });
  } catch (error) {
      console.error('Error updating settings', error);

      res.status(500).json({
          status: 'error',
          message: 'Error updating settings',
          error: error
      });
  }
};