import { useNavigate } from 'react-router-dom';
import styles from './AddNewClientButton.module.css';

export function AddNewClientButton() {
  const navigate = useNavigate();

  const handleAddClientClick = () => {
    navigate('add-client'); // Zmiana tutaj
  };

  return (
    <div className={styles.addNewClientContainer}>
      <button
        className={styles.addNewClientButton}
        onClick={handleAddClientClick}
      >
        Dodaj nowego klienta
      </button>
    </div>
  );
}
