import { useNavigate } from 'react-router-dom';
import styles from './AddNewEmployeeButton.module.css';

export function AddNewEmployeeButton() {
  const navigate = useNavigate();

  const handleAddEmployeeClick = () => {
    navigate('add-employee'); // Route do dodania nowego pracownika
  };


  return (
    <div className={styles.addNewEmployeeContainer}>
      <button
        className={styles.addNewEmployeeButton}
        onClick={handleAddEmployeeClick}
      >
        Dodaj nowego pracownika
      </button>
    </div>
  );
}
