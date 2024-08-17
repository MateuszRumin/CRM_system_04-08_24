import React, { useState } from 'react';
import faFilter from '../../assets/ClientPage/faFilter.svg';
import styles from './FilterInvoice.module.css';

interface FilterInvoiceProps {
  onFilter: (filterOptions: { [key: string]: string }) => void;
}

export function FilterInvoice({ onFilter }: FilterInvoiceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<string>('');
  const [client, setClient] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilterOptions({
      ...filterOptions,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onFilter(filterOptions);
    toggleModal();
  };

  const handleClearFilters = () => {
    setFilterOptions({});
    onFilter({});
    toggleModal();
  };

  return (
    <div className={styles.FilterInvoice}>
      <button className={styles.filterButton} onClick={toggleModal}>
        <img src={faFilter} alt="Filter Icon" className={styles.filterIcon} />
        Filtruj
      </button>

      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h2>Filtruj według kolumn</h2>
            <div className={styles.formGroup}>
              <label>Numer faktury</label>
              <input
                type="text"
                placeholder="Numer faktury"
                name="number"
                value={filterOptions.name || ''}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Status faktury</label>
              <select
                name="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setFilterOptions({
                    ...filterOptions,
                    status: e.target.value,
                  });
                }}
              >
                <option value="">Wybierz status</option>
                <option value="Nie wystawiona">Nie wystawiona</option>
                <option value="Wystawiona">Wystawiona</option>
                <option value="Zaksiegowana">Zaksięgowana</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Typ faktury</label>
              <input
                type="text"
                placeholder="Typ faktury"
                name="type"
                value={filterOptions.email || ''}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Data wystawienia</label>
              <input
                type="text"
                placeholder="Data wystawienia"
                name="issue_date"
                value={filterOptions.contract || ''}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Data wystawienia</label>
              <input
                type="text"
                placeholder="Termin płatności"
                name="due_date"
                value={filterOptions.contract || ''}
                onChange={handleChange}
              />
            </div>
            {/* Add additional filter options as needed */}
            <div className={styles.formActions}>
              <button className={styles.handleSubmitButton} onClick={handleSubmit}>Zastosuj filtry</button>
              <button className={styles.handleClearFiltersButton} onClick={handleClearFilters}>Wyczyść filtry</button>
              <button className={styles.toggleModalButton} onClick={toggleModal}>Anuluj</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
