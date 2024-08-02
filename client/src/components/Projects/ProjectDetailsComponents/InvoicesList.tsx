import React from 'react';
import styles from './InvoicesList.module.css';

const InvoicesList: React.FC = () => {
  const invoices = [
    { invoiceName: 'Faktura 1', date: '12.12.2024' },
    { invoiceName: 'Faktura 2', date: '12.12.2024' },
    { invoiceName: 'Faktura 3', date: '12.12.2024' },
  ];

  return (
    <div className={styles.invoices}>
      <h2>Lista faktur</h2>
      <table className={styles.invoicesTable}>
        <thead>
          <tr>
            <th>Nazwa faktury</th>
            <th>Data</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={index}>
              <td>{invoice.invoiceName}</td>
              <td>{invoice.date}</td>
              <td>
                <button className={styles.detailsButton}>Szczegóły</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.addButton}>Dodaj</button>
    </div>
  );
};

export default InvoicesList;
