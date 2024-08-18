import React, { useState } from 'react';
import styles from './FilterInvoice.module.css';

interface FilterInvoiceProps {
  onFilter: (filterOptions: { [key: string]: string }) => void;
}

export function FilterInvoice({ onFilter }: FilterInvoiceProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string[]>([]);
  const [invoiceType, setInvoiceType] = useState<string[]>([]);
  const [issueDate, setIssueDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const value = e.target.value;
    setter(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = () => {
    const filters: { [key: string]: string } = {};

    if (status.length) filters.status = status.join(',');
    if (paymentStatus.length) filters.payment_status = paymentStatus.join(',');
    if (invoiceType.length) filters.invoice_type = invoiceType.join(',');
    if (issueDate) filters.issue_date = issueDate;
    if (dueDate) filters.due_date = dueDate;
    if (invoiceNumber) filters.invoice_number = invoiceNumber;

    // console.log('Applied Filters:', filters);
    onFilter(filters);
    toggleFilter();
  };

  const handleClearFilters = () => {
    setFilterOptions({});
    setStatus([]);
    setPaymentStatus([]);
    setInvoiceType([]);
    setIssueDate('');
    setDueDate('');
    setInvoiceNumber('');
    onFilter({});
    toggleFilter();
  };

  return (
    <div className={styles.FilterInvoice}>
      <button className={styles.filterBox} onClick={toggleFilter}>
        <img src="/icons/filter.svg" alt="Filter" className={styles.icon} />
        <div className={styles.filterText}>Filtruj</div>
      </button>

      {isFilterOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.container}>
              <div className={styles.sectionGroup}>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Status faktury</h2>
                  {["Nie wystawiona", "Wystawiona", "Zaksiegowana"].map(option => (
                    <div key={option} className={styles.option}>
                      <input
                        type="checkbox"
                        value={option}
                        checked={status.includes(option)}
                        onChange={e => handleCheckboxChange(e, setStatus)}
                        className={status.includes(option) ? styles.checkboxSelected : styles.checkbox}
                      />
                      <span className={styles.optionText}>{option}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Data wystawienia</h2>
                  <div className={styles.dateContainer}>
                    <div className={styles.dateInput}>
                      <input
                        type="date"
                        name="issue_date"
                        value={issueDate}
                        onChange={e => {
                          setIssueDate(e.target.value);
                          setFilterOptions(prev => ({ ...prev, issue_date: e.target.value }));
                        }}
                        className={styles.inputField}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sectionGroup}>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Status płatności</h2>
                  {["Oczekuje na platnosc", "Oplacona", "Nie oplacona"].map(option => (
                    <div key={option} className={styles.option}>
                      <input
                        type="checkbox"
                        value={option}
                        checked={paymentStatus.includes(option)}
                        onChange={e => handleCheckboxChange(e, setPaymentStatus)}
                        className={paymentStatus.includes(option) ? styles.checkboxSelected : styles.checkbox}
                      />
                      <span className={styles.optionText}>{option}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.section}>
                  <div className={styles.dateContainer}>
                    <h2 className={styles.sectionTitle}>Termin płatności</h2>
                    <div className={styles.dateInput}>
                      <input
                        type="date"
                        name="due_date"
                        value={dueDate}
                        onChange={e => {
                          setDueDate(e.target.value);
                          setFilterOptions(prev => ({ ...prev, due_date: e.target.value }));
                        }}
                        className={styles.inputField}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sectionGroup}>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Typ faktury</h2>
                  {["VAT", "Zaliczkowa", "Okresowa", "Koncowa"].map(option => (
                    <div key={option} className={styles.option}>
                      <input
                        type="checkbox"
                        value={option}
                        checked={invoiceType.includes(option)}
                        onChange={e => handleCheckboxChange(e, setInvoiceType)}
                        className={invoiceType.includes(option) ? styles.checkboxSelected : styles.checkbox}
                      />
                      <span className={styles.optionText}>{option}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Numer faktury</h2>
                  <div className={styles.dateInput}>
                    <input
                      type="text"
                      placeholder="Numer faktury"
                      name="invoice_number"
                      value={invoiceNumber}
                      onChange={e => {
                        setInvoiceNumber(e.target.value);
                        setFilterOptions(prev => ({ ...prev, invoice_number: e.target.value }));
                      }}
                      className={styles.inputField}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.buttonCancel} onClick={toggleFilter}>Anuluj</button>
              <button className={styles.buttonCancel} onClick={handleClearFilters}>Wyczyść filtry</button>
              <button className={styles.buttonFilter} onClick={handleSubmit}>Zastosuj filtry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
