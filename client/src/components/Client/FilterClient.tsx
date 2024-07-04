import { useState, useEffect } from 'react';
import faFilter from '../../assets/ClientPage/faFilter.svg';
import styles from './FilterClient.module.css';

interface FilterClientProps {
  onFilter: (filterOptions: { [key: string]: string }) => void;
}

export function FilterClient({ onFilter }: FilterClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>({});
  const [activeProjects, setActiveProjects] = useState<string>('');
  const [totalProjects, setTotalProjects] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [addedDate, setAddedDate] = useState<string>('');
  const [addedSource, setAddedSource] = useState<string>('');

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilterOptions({
      ...filterOptions,
      [e.target.name]: e.target.value,
    });
  };

  const handleProjectsChange = () => {
    const projectsFilter = `${activeProjects} / ${totalProjects}`;
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      projects: projectsFilter,
    }));
  };

  const handlePaymentChange = () => {
    if (invoiceNumber || paymentDate || paymentAmount) {
      const nextPaymentFilter = `FV #${invoiceNumber || ''} - ${paymentDate || ''} - ${paymentAmount || ''} zł netto`;
      setFilterOptions((prevOptions) => ({
        ...prevOptions,
        nextPayment: nextPaymentFilter,
      }));
    } else {
      setFilterOptions((prevOptions) => {
        const newOptions = { ...prevOptions };
        delete newOptions.nextPayment;
        return newOptions;
      });
    }
  };
  

  const handleAddedChange = () => {
    if (addedDate || addedSource) {
      // Formatowanie daty na DD.MM.YYYY
      const formattedDate = addedDate.split('-').reverse().join('.');
      const addedFilter = `${formattedDate || ''} - ${addedSource || ''}`;
      setFilterOptions((prevOptions) => ({
        ...prevOptions,
        addedOn: addedFilter,
      }));
    } else {
      setFilterOptions((prevOptions) => {
        const newOptions = { ...prevOptions };
        delete newOptions.addedOn;
        return newOptions;
      });
    }
  };
  
  

  useEffect(() => {
    handleProjectsChange();
    handlePaymentChange();
    handleAddedChange();
  }, [activeProjects, totalProjects, invoiceNumber, paymentDate, paymentAmount, addedDate, addedSource]);

  const handleSubmit = () => {
    onFilter(filterOptions);
    toggleModal();
    console.log(paymentDate);
  };

  const handleClearFilters = () => {
    setFilterOptions({});
    setActiveProjects('');
    setTotalProjects('');
    setInvoiceNumber('');
    setPaymentDate('');
    setPaymentAmount('');
    setAddedDate('');
    setAddedSource('');
    onFilter({});
    toggleModal();
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
            <h2>Filtruj według kolumn</h2>
            <div className={styles.formGroup}>
              <label>Imię i nazwisko / Firma</label>
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
                value={filterOptions.status || ''}
                onChange={handleChange}
              >
                <option value="">Wybierz status</option>
                <option value="Niepodjęty">Niepodjęty</option>
                <option value="W trakcie">W trakcie</option>
                <option value="Stracony">Stracony</option>
                <option value="Zdobyty">Zdobyty</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Projekty</label>
              <input
                type="text"
                placeholder="Aktywne"
                value={activeProjects}
                onChange={(e) => setActiveProjects(e.target.value)}
              />
              <input
                type="text"
                placeholder="Wszystkie"
                value={totalProjects}
                onChange={(e) => setTotalProjects(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nadchodząca płatność</label>
              <input
                type="text"
                name="invoiceNumber"
                placeholder="Numer faktury"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
              <input
                type="date"
                name="paymentDate"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
              <input
                type="text"
                name="paymentAmount"
                placeholder="Kwota"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Dodano</label>
              <input
                type="date"
                name="addedDate"
                value={addedDate}
                onChange={(e) => setAddedDate(e.target.value)}
              />
              <select
              name="addedSource"
              value={addedSource}
              onChange={(e) => setAddedSource(e.target.value)}
            >
              <option value="">Wybierz źródło</option>
              <option value="Polecenie">Polecenie</option>
              <option value="Organiczny">Organiczny</option>
            </select>
            </div>
            <div className={styles.modalButtons}>
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
