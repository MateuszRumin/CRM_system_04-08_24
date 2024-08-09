import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from './InvoiceDetails.module.css';

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
}

interface Invoice {
  invoice_id: number;
  invoice_number: string | null;
  issue_date: string | null;
  due_date: string | null;
  prize_brutto: number;
  Status: Status; // Ensure that status is of type Status
  InvoiceType: InvoiceType;
  Client: Client;
  InvoiceProduct: InvoiceProduct[];
}

export function InvoiceDetails() {
  const location = useLocation();
  const invoiceId = location.pathname.split('/').pop();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (!invoiceId) return;

      try {
        const response = await axios.get(`http://localhost:3000/invoices/${invoiceId}`);
        console.log('Fetched invoice data:', response.data);
        setInvoice(response.data);
      } catch (err) {
        console.error('Error fetching invoice details:', err);
        setError('Failed to fetch invoice details');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!invoice) return <p className={styles.error}>No invoice found</p>;

  return (
    <div className={styles.container}>
      <h1>Szczegóły Faktury</h1>
      <div className={styles.gridContainer}>
        <div className={styles.section}>
          <h2>Ogólne Informacje</h2>
          <p><strong>Numer faktury:</strong> {invoice.invoice_number || 'N/A'}</p>
          <p><strong>Typ faktury:</strong> {invoice.InvoiceType?.invoice_type || 'N/A'}</p>
          <p><strong>Data wystawienia:</strong> {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Termin opłaty:</strong> {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Kwota brutto:</strong> ${invoice.prize_brutto.toFixed(2)}</p>
          <p><strong>Status:</strong> {invoice.Status?.name || 'N/A'}</p>
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

        <div className={`${styles.section} ${styles.productSection}`}>
          <h2>Powiązane produkty</h2>
          {invoice.InvoiceProduct.length > 0 ? (
            <div>
              {invoice.InvoiceProduct.map((product) => (
                <div key={product.invoice_product_id} className={styles.product}>
                  <h3>Projekt: {product.Project?.name || 'N/A'}</h3>
                  <p><strong>Nazwa produktu:</strong> {product.product_name}</p>
                  <p><strong>Cena jednostkowa:</strong> ${product.unit_price.toFixed(2)}</p>
                  <p><strong>Ilość:</strong> {product.product_count}</p>
                  <p><strong>Kwota:</strong> ${product.prize.toFixed(2)}</p>
                  <p><strong>Podatek:</strong> ${product.tax.toFixed(2)}</p>
                  <hr />
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