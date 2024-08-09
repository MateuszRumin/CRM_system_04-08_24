import React from 'react';
import faSearch from '../../assets/ClientPage/faSearch.svg';
import styles from './SearchInvoice.module.css';

interface Props {
  placeholder?: string;
  onSearch: (term: string) => void;
}

export function SearchInvoice({ placeholder = 'Wyszukaj fakture', onSearch }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className={styles['search-invoice']}>
      <img src={faSearch} alt="Search Icon" className={styles.searchIcon} />
      <input
        type="text"
        placeholder={placeholder}
        className={styles.searchInput}
        onChange={handleChange}
      />
    </div>
  );
}
