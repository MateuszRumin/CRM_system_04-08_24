import React from 'react';
import faSearch from '../../assets/ClientPage/faSearch.svg';
import styles from './SearchEmployee.module.css';

interface Props {
  placeholder?: string;
  onSearch: (term: string) => void;
}

export function SearchEmployee({ placeholder = 'Wyszukaj pracownika', onSearch }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className={styles['search-employee']}>
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
