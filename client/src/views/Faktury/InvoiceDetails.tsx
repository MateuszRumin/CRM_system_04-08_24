import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from './InvoiceDetails.module.css';
import { sendInvoiceEmail } from '../../services/apiService';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface Project {
  project_id: number;
  name: string;
  client_id: number;
  status_id: number;
  created_at: string;
}

interface InvoiceProduct {
  invoice_product_id: number;
  project_id: number;
  product_name: string;
  unit_price: number;
  product_count: number;
  prize: number;
  tax: number;
  Project: Project;
}

interface Status {
  status_id: number;
  status_type: string;
  default: boolean;
  name: string;
}

interface InvoiceType {
  invoice_type_id: number;
  invoice_type: string;
}

interface ClientEmail {
  email_id: number;
  client_id: number;
  email: string;
}

interface Client {
  client_id: number;
  first_name: string;
  second_name: string;
  company_name: string;
  address: string;
  client_type: string;
  regon: string;
  nip: string;
  krs: string;
  registration_date: string;
  ClientEmail: ClientEmail[];
}

interface Invoice {
  invoice_id: number;
  invoice_number: string | null;
  issue_date: string | null;
  due_date: string | null;
  prize_brutto: number;
  Status: Status;
  InvoiceType: InvoiceType;
  InvoicePayment: InvoicePayment;
  Client: Client;
  InvoiceProduct: InvoiceProduct[];
}

interface InvoicePayment {
  payment_id: number;
  invoice_id: number; // Dodano invoice_id
  status_id: number;
  Status: Status;
}

export function InvoiceDetails() {
  const location = useLocation();
  const invoiceId = location.pathname.split('/').pop();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [clientEmails, setClientEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (!invoiceId) return;

      try {
        const response = await axios.get(`${apiServerUrl}/invoices/${invoiceId}`);
        setInvoice(response.data);

        if (response.data.Client?.client_id) {
          const clientResponse = await axios.get(`${apiServerUrl}/client/${response.data.Client.client_id}/get`);
          setClientEmails(clientResponse.data.ClientEmail.map((email: ClientEmail) => email.email));
        }
      } catch (err) {
        console.error('Error fetching invoice details:', err);
        setError('Failed to fetch invoice details');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

  const generatePDF = () => {
    if (!invoice) return;

    const doc = new jsPDF();
    doc.setFontSize(12);

    // Header
    doc.setFontSize(18);
    doc.text('Faktura VAT', 14, 20);

    // Company Information
    doc.setFontSize(12);
    doc.text('Weblance Kamil Wojnarowski', 14, 30); // Zastąp rzeczywistą nazwą firmy
    doc.text('Adres: 55, 33-386 Olszanka', 14, 35); // Zastąp rzeczywistym adresem
    doc.text('NIP: 734-361-50-41', 14, 40); // Zastąp rzeczywistym NIP
    doc.text('REGON: 523051231', 14, 45); // Zastąp rzeczywistym REGON

    // Invoice Details
    doc.text(`Numer faktury: ${invoice.invoice_number || 'N/A'}`, 14, 55);
    doc.text(`Data wystawienia: ${invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : 'N/A'}`, 14, 60);
    doc.text(`Termin platnosci: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}`, 14, 65);
    doc.text(`Status: ${invoice.Status?.name || 'N/A'}`, 14, 70);

    // Client Information
    doc.setFontSize(14);
    doc.text('Dane Klienta', 14, 80);
    doc.setFontSize(12);
    doc.text(`Imie i nazwisko: ${invoice.Client?.first_name || 'N/A'} ${invoice.Client?.second_name || 'N/A'}`, 14, 90);
    doc.text(`Nazwa firmy: ${invoice.Client?.company_name || 'N/A'}`, 14, 95);
    doc.text(`Adres: ${invoice.Client?.address || 'N/A'}`, 14, 100);
    doc.text(`NIP: ${invoice.Client?.nip || 'N/A'}`, 14, 105);

    // Products Table
    doc.setFontSize(14);
    doc.text('Szczegoly Produktow', 14, 115);
    doc.autoTable({
      startY: 120,
      head: [['Projekt', 'Produkt', 'Cena jednostkowa', 'Ilosc', 'Kwota', 'Podatek']],
      body: invoice.InvoiceProduct.map(product => [
        product.Project?.name || 'N/A',
        product.product_name,
        `$${product.unit_price.toFixed(2)}`,
        product.product_count,
        `$${product.prize.toFixed(2)}`,
        `$${product.tax.toFixed(2)}`
      ]),
      theme: 'striped',
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [236, 240, 241] },
    });

    // Summary
    const totalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Podsumowanie', 14, totalY);
    doc.text(`Kwota brutto: $${invoice.prize_brutto.toFixed(2)}`, 14, totalY + 10);

    // Footer
    const footerY = totalY + 30;
    doc.setFontSize(10);
    doc.text('Dziekujemy za dokonanie zakupu. W przypadku pytan prosimy o kontakt.', 14, footerY);
    doc.text('Kontakt: biuro@weblance.pl | Tel: 533-931-289', 14, footerY + 5);

    // Output PDF
    const pdfOutput = doc.output('blob');
    setPdfBlob(pdfOutput);

    // Save PDF
    doc.save(`invoice_${invoice.invoice_number || 'N/A'}.pdf`);
  };
  

  const updateInvoiceStatus = async (statusId: number) => {
    if (!invoice) return;

    try {
      await axios.post(`${apiServerUrl}/invoices/updateInvoice`, {
        main: {
          invoice_id: invoice.invoice_id,
          status_id: statusId,
        },
        summary: {
          prize_netto: invoice.prize_brutto / 1.23,
          tax_ammount: invoice.prize_brutto - (invoice.prize_brutto / 1.23),
          comments: 'Zaktualizowana faktura',
        },
      });
    } catch (err) {
      console.error('Error updating invoice status:', err);
      alert('Błąd aktualizacji statusu faktury');
    }
  };

  const sendEmail = async () => {
    if (!pdfBlob || !invoice) return;

    try {
      clientEmails.forEach(email => {
        console.log(`Wysyłanie faktury na adres e-mail: ${email}`);
        sendInvoiceEmail(email, pdfBlob, `invoice_${invoice.invoice_number || 'N/A'}.pdf`);
      });

      await updateInvoiceStatus(12); // 12 to ID statusu "Oczekuje na płatność"
      await refreshInvoice();

      // Show notification popup
      setShowNotification(true);
      
      // Hide notification popup after 3 seconds
      setTimeout(() => setShowNotification(false), 3000);

    } catch (err) {
      console.error('Error sending invoice email:', err);
      alert('Błąd wysyłania e-maila z fakturą');
    }
  };

  const refreshInvoice = async () => {
    if (!invoiceId) return;

    try {
      const response = await axios.get(`${apiServerUrl}/invoices/${invoiceId}`);
      setInvoice(response.data);

      if (response.data.Client?.client_id) {
        const clientResponse = await axios.get(`${apiServerUrl}/client/${response.data.Client.client_id}/get`);
        setClientEmails(clientResponse.data.ClientEmail.map((email: ClientEmail) => email.email));
      }
    } catch (err) {
      console.error('Error fetching invoice details:', err);
      setError('Failed to fetch invoice details');
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!invoice) return <p className={styles.error}>No invoice found</p>;

  return (
    <div className={styles.container}>
      {showNotification && (
        <div className={styles.notification}>
          <p>Faktura została wysłana!</p>
        </div>
      )}
      <h1>Szczegóły Faktury</h1>
      <button onClick={generatePDF} className={styles.button}>Generuj Fakturę</button>
      <button onClick={sendEmail} disabled={!pdfBlob} className={styles.button}>Wyślij E-mail</button>
      <div className={styles.gridContainer}>
        <div className={styles.section}>
          <h2>Ogólne Informacje</h2>
          <p><strong>Numer faktury:</strong> {invoice.invoice_number || 'N/A'}</p>
          <p><strong>Typ faktury:</strong> {invoice.InvoiceType?.invoice_type || 'N/A'}</p>
          <p><strong>Data wystawienia:</strong> {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Termin opłaty:</strong> {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Kwota brutto:</strong> ${invoice.prize_brutto.toFixed(2)}</p>
          <p><strong>Status:</strong> {invoice.Status?.name || 'N/A'}</p>
          <p><strong>Status płatności: </strong> 
          {invoice.InvoicePayment.length > 0 ? (
            invoice.InvoicePayment.map(payment => (
              <span key={payment.payment_id}>{payment.Status.name}{' '}</span>
            ))
          ) : 'Brak płatności'}
        </p>
        </div>

        <div className={styles.section}>
          <h2>Informacje o Kliencie</h2>
          <p><strong>Imię:</strong> {invoice.Client?.first_name || 'N/A'}</p>
          <p><strong>Nazwisko:</strong> {invoice.Client?.second_name || 'N/A'}</p>
          <p><strong>Nazwa firmy:</strong> {invoice.Client?.company_name || 'N/A'}</p>
          <p><strong>Adres:</strong> {invoice.Client?.address || 'N/A'}</p>
          <p><strong>Typ klienta:</strong> {invoice.Client?.client_type || 'N/A'}</p>
          <p><strong>REGON:</strong> {invoice.Client?.regon || 'N/A'}</p>
          <p><strong>NIP:</strong> {invoice.Client?.nip || 'N/A'}</p>
          <p><strong>KRS:</strong> {invoice.Client?.krs || 'N/A'}</p>
          <p><strong>Data rejestracji:</strong> {invoice.Client?.registration_date ? new Date(invoice.Client.registration_date).toLocaleDateString() : 'N/A'}</p>
        </div>

        <div className={styles.productSection}>
          <h2>Powiązane Produkty</h2>
          {invoice.InvoiceProduct.length > 0 ? (
            <div>
              {invoice.InvoiceProduct.map(product => (
                <div key={product.invoice_product_id} className={styles.product}>
                  <p><strong>Projekt:</strong> {product.Project?.name || 'N/A'}</p>
                  <p><strong>Produkt:</strong> {product.product_name}</p>
                  <p><strong>Cena jednostkowa:</strong> ${product.unit_price.toFixed(2)}</p>
                  <p><strong>Ilość:</strong> {product.product_count}</p>
                  <p><strong>Kwota:</strong> ${product.prize.toFixed(2)}</p>
                  <p><strong>Podatek:</strong> ${product.tax.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Brak produktów</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;