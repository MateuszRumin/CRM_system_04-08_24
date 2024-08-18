import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './InvoiceTable.module.css';
import Pagination from './Pagination';
import { InvoiceRow } from './InvoiceRow';

interface Invoice {
  invoice_id: number;
  invoice_number: string | null;
  client_name: string;
  invoice_type: string;
  issue_date: string | null;
  due_date: string | null;
  prize_brutto: number;
  status: string;
  payment_status: string;
}

interface InvoiceTableProps {
  searchTerm: string;
  filterOptions: { [key: string]: string };
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ searchTerm, filterOptions }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const itemsPerPageOptions: number[] = [10, 20, 30, 50];

  useEffect(() => {
    axios.get('http://localhost:3000/invoices')
      .then(response => {
        setInvoices(response.data);
        setFilteredInvoices(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the invoices!', error);
      });
  }, []);

  useEffect(() => {
    let results = invoices.filter(invoice =>
      invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (Object.keys(filterOptions).length > 0) {
      results = results.filter(invoice => {
        return Object.entries(filterOptions).every(([key, value]) => {
          if (!value) return true; 
          const valuesArray = value.split(','); 
          const invoiceValue = invoice[key as keyof Invoice]?.toString() || ''; 

          return valuesArray.some(val => invoiceValue.toLowerCase().includes(val.toLowerCase())); 
        });
      });
    }

    setFilteredInvoices(results);
    setCurrentPage(1);
  }, [searchTerm, filterOptions, invoices]);

  const indexOfLastInvoice: number = currentPage * itemsPerPage;
  const indexOfFirstInvoice: number = indexOfLastInvoice - itemsPerPage;
  const currentInvoices: Invoice[] = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleDelete = (invoiceNumber: string | null) => {
    setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.invoice_number !== invoiceNumber));
    setFilteredInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.invoice_number !== invoiceNumber));
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Numer Faktury</th>
            <th>Klient</th>
            <th>Typ Faktury</th>
            <th>Status</th>
            <th>Data Wystawienia</th>
            <th>Termin płatności</th>
            <th>Kwota brutto</th>
            <th>Status płatności</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {currentInvoices.map((invoice) => (
            <InvoiceRow key={invoice.invoice_number || ''} invoice={invoice} onDelete={handleDelete} />
          ))}
        </tbody>
      </table>
      <Pagination
        itemsPerPageOptions={itemsPerPageOptions}
        itemsPerPage={itemsPerPage}
        totalItems={filteredInvoices.length}
        currentPage={currentPage}
        paginate={paginate}
        changeItemsPerPage={changeItemsPerPage}
      />
    </div>
  );
};
