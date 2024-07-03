// FilterSettingsModal.tsx

import React from 'react';
import styles from './FilterSettingsModal.module.css';

interface FilterSettingsProps {
  onClose: () => void;
}

const FilterSettingsModal: React.FC<FilterSettingsProps> = ({ onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Ustawienia filtra</h2>
        {/* Rodzaj Faktury dropdown */}
        <label>Rodzaj Faktury:</label>
        <select>
          <option>VAT</option>
          <option>Zaliczka</option>
          <option>Końcowa</option>
        </select>

        {/* Status Faktury dropdown */}
        <label>Status Faktury:</label>
        <select>
          <option>Opłacona</option>
          <option>Oczekuje na płatność</option>
          <option>Nieopłacona</option>
        </select>

        {/* Data wystawienia od - do */}
        <label>Data wystawienia od:</label>
        <input type="date" />

        <label>Data wystawienia do:</label>
        <input type="date" />

        {/* Kwota Faktury od - do */}
        <label>Kwota Faktury od:</label>
        <input type="number" />

        <label>Kwota Faktury do:</label>
        <input type="number" />

        {/* Status płatności dropdown */}
        <label>Status płatności:</label>
        <select>
          <option>Opłacona</option>
          <option>Oczekuje na płatność</option>
          <option>Nieopłacona</option>
        </select>

        <div className={styles.buttons}>
          <button onClick={onClose}>Zamknij</button>
          <button>Filtruj</button>
        </div>
      </div>
    </div>
  );
};

export default FilterSettingsModal;
