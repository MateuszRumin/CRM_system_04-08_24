import { useState } from 'react';
import faFilter from '../../assets/ClientPage/faFilter.svg';
import styles from './FilterClient.module.css';

export function FilterClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={styles.filterClient}>
      <button className={styles.filterButton} onClick={toggleModal}>
        <img src={faFilter} alt="Filter Icon" className={styles.filterIcon} />
        Filtruj
      </button>

      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            {/* Tutaj można dodać formularz lub inne elementy do filtrowania */}
            <p>Modal do filtrowania tabeli</p>
            <button onClick={toggleModal}>Zamknij</button>
          </div>
        </div>
      )}
    </div>
  );
}
