import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './InvoiceRow.module.css';
import ThreeDotsSettings from '../../assets/ClientPage/three_dots_settings.svg';
import axios from 'axios';

// interface InvoicePayment {
//   payment_id: number;
//   status: string;
// }

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


interface InvoiceRowProps {
  invoice: Invoice;
  onDelete: (invoiceNumber: string | null) => void;
}

export const InvoiceRow: React.FC<InvoiceRowProps> = ({ invoice, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.settingsContainer}`)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [setIsMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/invoices/${invoice.invoice_id}`);
      onDelete(invoice.invoice_number); // Notify the parent component
    } catch (error) {
      console.error('There was a problem deleting the invoice:', error);
    }
    setIsModalOpen(false);
  };

  const handleDetails = () => {
    navigate(`/faktury/details-invoice/${invoice.invoice_id}`, { state: { invoice } });
  };

  const handleEdit = () => {
    navigate(`/faktury/edit-invoice/${invoice.invoice_id}`, { state: { invoice } });
  };

  const formatInvoiceNumber = (invoiceNumber: string | null, invoiceType: string) => {
    if (!invoiceNumber) return 'N/A';
    
    // Dodaje znacznik FV lub FZ przed numerem faktury
    return invoiceType === 'Zaliczkowa'
      ? `FZ/${invoiceNumber}`
      : `FV/${invoiceNumber}`;
  };

  return (
    <>
      <tr className={`${styles.row} ${styles.invoiceRow}`}>
      <td>{formatInvoiceNumber(invoice.invoice_number, invoice.invoice_type)}</td>
        <td className={styles.clientColumn}>{invoice.client_name ?? 'N/A'}</td>
        <td>{invoice.invoice_type ?? 'N/A'}</td>
        <td>{invoice.status ?? 'N/A'}</td>
        <td>{invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : 'N/A'}</td>
        <td>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}</td>
        <td>{invoice.prize_brutto.toFixed(2)} PLN</td>
        <td>{invoice.payment_status ?? 'N/A'}</td>
        <td className={styles.settingsContainer}>
          {/* <button className={styles.detailsButton} onClick={handleDetails}>Szczegóły</button> */}
          <img
            src={ThreeDotsSettings}
            alt="Settings"
            className={styles.settingsIcon}
            onClick={toggleMenu}
          />
          {isMenuOpen && (
            <div className={styles.contextMenu}>
              <div onClick={handleDetails}>Szczegóły</div>
              <div onClick={handleEdit}>Edytuj</div>
              <div onClick={handleDelete}>Usuń</div>
            </div>
          )}
        </td>
      </tr>

      {isModalOpen && (
        <tr>
          <td colSpan={8}>
            <div className={styles.modalBackdrop}>
              <div className={styles.modal}>
                <p>Czy na pewno chcesz usunąć tę fakturę?</p>
                <button onClick={confirmDelete}>Tak</button>
                <button onClick={() => setIsModalOpen(false)}>Nie</button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};