import axios from 'axios';
const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

export const sendInvoiceEmail = async (email: string, pdf: Blob, filename: string) => {
  const reader = new FileReader();
  reader.readAsDataURL(pdf);
  reader.onloadend = async () => {
    const base64data = reader.result?.toString().split(',')[1];

    if (base64data) {
      try {
        await axios.post(`${apiServerUrl}/email/send-invoice-email`, {
          to: email,
          subject: 'Twoja faktura',
          text: 'Proszę znaleźć załączoną fakturę.',
          attachment: {
            filename,
            content: base64data,
            encoding: 'base64',
          },
        });
        console.log(`Wysłano fakturę do: ${email}`);
      } catch (err) {
        console.error(`Nie udało się wysłać faktury do: ${email}`, err);
      }
    }
  };
};
