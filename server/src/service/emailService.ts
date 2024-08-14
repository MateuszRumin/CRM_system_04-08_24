import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = (
  to: string,
  subject: string,
  text: string,
  attachment?: { filename: string; content: string; encoding: string }
) => {
  const mailOptions: any = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  if (attachment) {
    mailOptions.attachments = [
      {
        filename: attachment.filename,
        content: attachment.content,
        encoding: attachment.encoding,
      },
    ];
  }

  return transporter.sendMail(mailOptions);
};
