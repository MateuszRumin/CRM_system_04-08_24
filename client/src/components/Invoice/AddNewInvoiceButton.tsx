import { useNavigate } from 'react-router-dom';
import styles from './AddNewInvoiceButton.module.css';

export function AddNewInvoiceButton() {
  const navigate = useNavigate();

  const handleAddInvoiceClick = () => {
    navigate('faktury/new'); // Route do dodania nowej fcktury
  };


  return (
    <div className={styles.addNewInvoiceContainer}>
      <button
        className={styles.addNewInvoiceButton}
        onClick={handleAddInvoiceClick}
      >
        Dodaj nową fakturę
      </button>
    </div>
  );
}
