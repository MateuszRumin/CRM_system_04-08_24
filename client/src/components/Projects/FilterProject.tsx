import React, { useState, useEffect } from 'react';
import faFilter from '../../assets/ClientPage/faFilter.svg';
import styles from './FilterProject.module.css';

interface FilterProjectProps {
  onFilter: (filterOptions: { [key: string]: string }) => void;
}

export function FilterProject({ onFilter }: FilterProjectProps) {
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

  const handleDatesChange = () => {
    if (startDate || endDate) {
      setFilterOptions((prevOptions) => ({
        ...prevOptions,
        startDate: startDate,
        endDate: endDate,
      }));
    } else {
      setFilterOptions((prevOptions) => {
        const newOptions = { ...prevOptions };
        delete newOptions.startDate;
        delete newOptions.endDate;
        return newOptions;
      });
    }
  };

  useEffect(() => {
    handleDatesChange();
  }, [startDate, endDate]);

  const handleSubmit = () => {
    onFilter(filterOptions);
    toggleModal();
  };

  const handleClearFilters = () => {
    setFilterOptions({});
    setStatus('');
    setClient('');
    setStartDate('');
    setEndDate('');
    onFilter({});
    toggleModal();
  };

  return (
    <div className={styles.filterProject}>
      <button className={styles.filterButton} onClick={toggleModal}>
        <img src={faFilter} alt="Filter Icon" className={styles.filterIcon} />
        Filtruj
      </button>

      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h2>Filtruj według kolumn</h2>
            <div className={styles.formGroup}>
              <label>Nazwa projektu</label>
              <input
                type="text"
                placeholder="Nazwa"
                name="name"
                value={filterOptions.name || ''}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
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
                <option value="Nie rozpoczęty">Nie rozpoczęty</option>
                <option value="W trakcie">W trakcie</option>
                <option value="Zakończony">Zakończony</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Klient</label>
              <input
                type="text"
                placeholder="Klient"
                name="client"
                value={client}
                onChange={(e) => {
                  setClient(e.target.value);
                  setFilterOptions({
                    ...filterOptions,
                    client: e.target.value,
                  });
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Data rozpoczęcia</label>
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Data zakończenia</label>
              <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className={styles.modalButtons}>
              <button className={styles.handleSubmitButton} onClick={handleSubmit}>
                Zastosuj filtry
              </button>
              <button className={styles.handleClearFiltersButton} onClick={handleClearFilters}>
                Wyczyść filtry
              </button>
              <button className={styles.toggleModalButton} onClick={toggleModal}>
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
