import { Request, Response } from 'express';
import { sendEmail } from '../../../../server/src/service/emailService';

export const sendInvoiceEmail = async (req: Request, res: Response) => {
  const { to, subject, text, attachment } = req.body;

  try {
    await sendEmail(to, subject, text, attachment);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
};
