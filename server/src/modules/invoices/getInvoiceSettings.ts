import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const invoiceSettings = await prisma.invoiceSettings.findMany({});

    // const invoicePaymentSettings = await prisma.invoicePaymentSettings.findMany({
    //   include: {
    //     CompanySetting: {
    //       select: {
    //         name: true,
    //         address: true,
    //         regon: true,
    //         nip: true,
    //         krs: true
    //       }
    //     }
    //   }
    // });

    // const invoiceTypes = await prisma.invoiceTypes.findMany({
    //   select: {
    //     invoice_type_id: true,
    //     invoice_type: true,
    //     numbering_format: true,
    //     enabled: true,
    //     current_number_sequence: true,
    //     template: true,
    //   }
    // });

    // const formattedSettings = {
    //   invoiceSettings: invoiceSettings.map(setting => ({
    //     id: setting.invoice_setting_id,
    //     currency: setting.default_currency,
    //     paymentTerm: setting.payment_term,
    //     periodicAutoGenerate: setting.periodic_auto_generate,
    //     periodicFrequency: setting.periodic_frequency,
    //     emailNotification: setting.email_notification,
    //     smsNotification: setting.sms_notification,
    //     pushNotification: setting.push_notification,
    //     unpaidReminder: setting.unpaid_reminder_enabled,
    //     reminderFreq: setting.reminder_frequency,
    //     reminderContent: setting.reminder_content
    //   })),
    //   invoicePaymentSettings: invoicePaymentSettings.map(setting => ({
    //     id: setting.payment_setting_id,
    //     advancementRate: setting.advancement_rate,
    //     taxRate: setting.tax_rate,
    //     taxType: setting.tax_type,
    //     defaultVatAmount: setting.default_vat_amount,
    //     company: setting.CompanySetting
    //   })),
    //   invoiceTypes: invoiceTypes.map(type => ({
    //     id: type.invoice_type_id,
    //     type: type.invoice_type,
    //     numberingFormat: type.numbering_format,
    //     enabled: type.enabled,                 
    //     current_number: type.current_number_sequence,   
    //     template: type.template                 
    //   }))
    // };

    // res.json(formattedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

