// import { Request, Response, NextFunction } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export const getAllSettings = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const invoiceSettings = await prisma.invoiceSettings.findMany({});

//     const invoicePaymentSettings = await prisma.invoicePaymentSettings.findMany({
//       include: {
//         CompanySetting: {
//           select: {
//             name: true,
//             address: true,
//             regon: true,
//             nip: true,
//             krs: true
//           }
//         }
//       }
//     });

//     const invoiceTypes = await prisma.invoiceTypes.findMany({
//       select: {
//         invoice_type_id: true,
//         invoice_type: true,
//         numbering_format: true,
//         email_notification: true,
//         sms_notification: true,
//         push_notification: true,
//         unpaid_reminder_enabled: true,
//         reminder_frequency: true,
//         reminder_content: true,
//       }
//     });

//     const companies = await prisma.companySettings.findMany({
//       select: {
//         company_id: true,
//         name: true,
//         address: true,
//         regon: true,
//         nip: true,
//         krs: true
//       }
//     });

//     const formattedSettings = {
//       invoiceSettings: invoiceSettings.map(setting => ({
//         id: setting.invoice_setting_id,
//         year: setting.current_number_year,
//         month: setting.current_number_month,
//         sequence: setting.current_number_sequence,
//         currency: setting.default_currency,
//         template: setting.template,
//         paymentTerm: setting.payment_term,
//         vatEnabled: setting.vat_enabled,
//         advanceEnabled: setting.advance_enabled,
//         finalEnabled: setting.final_enabled,
//         proformaEnabled: setting.proforma_enabled,
//         periodicEnabled: setting.periodic_enabled,
//         periodicAutoGenerate: setting.periodic_auto_generate,
//         periodicFrequency: setting.periodic_frequency,
//       })),
//       invoicePaymentSettings: invoicePaymentSettings.map(setting => ({
//         id: setting.payment_setting_id,
//         advancementRate: setting.advancement_rate,
//         taxRate: setting.tax_rate,
//         taxType: setting.tax_type,
//         defaultVatAmount: setting.default_vat_amount,
//         company: setting.CompanySetting
//       })),
//       invoiceTypes: invoiceTypes.map(type => ({
//         id: type.invoice_type_id,
//         type: type.invoice_type,
//         numberingFormat: type.numbering_format,
//         emailNotification: type.email_notification,
//         smsNotification: type.sms_notification,
//         pushNotification: type.push_notification,
//         unpaidReminderEnabled: type.unpaid_reminder_enabled,
//         reminderFrequency: type.reminder_frequency,
//         reminderContent: type.reminder_content
//       })),
//       companies: companies.map(company => ({
//         id: company.company_id,
//         name: company.name,
//         address: company.address,
//         regon: company.regon,
//         nip: company.nip,
//         krs: company.krs
//       }))
//     };

//     res.json(formattedSettings);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

