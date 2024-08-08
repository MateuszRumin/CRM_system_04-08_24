import React, { useState } from 'react';
import faFilter from '../../assets/ClientPage/faFilter.svg';
import styles from './FilterInvoice.module.css';

interface FilterInvoiceProps {
  onFilter: (filterOptions: { [key: string]: string }) => void;
}

export function FilterInvoice({ onFilter }: FilterInvoiceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>({});

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
              <label>Imię i nazwisko</label>
              <input
                type="text"
                placeholder="Nazwa"
                name="name"
                value={filterOptions.name || ''}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="text"
                placeholder="Email"
                name="email"
                value={filterOptions.email || ''}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Kontrakt</label>
              <input
                type="text"
                placeholder="Kontrakt"
                name="contract"
                value={filterOptions.contract || ''}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Numer telefonu</label>
              <input
                type="text"
                placeholder="Numer telefonu"
                name="phoneNumber"
                value={filterOptions.phoneNumber || ''}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Adres</label>
              <input
                type="text"
                placeholder="Adres"
                name="address"
                value={filterOptions.address || ''}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Stanowisko</label>
              <select
                name="position"
                value={filterOptions.position || ''}
                onChange={handleChange}
              >
                <option value="">Wybierz stanowisko</option>
                <option value="Programista">Programista</option>
                <option value="Tester">Tester</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Rola</label>
              <select
                name="role"
                value={filterOptions.role || ''}
                onChange={handleChange}
              >
                <option value="">Wybierz rolę</option>
                <option value="Administrator">Administrator</option>
                <option value="User">User</option>
              </select>
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
