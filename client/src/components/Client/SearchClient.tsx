import React from 'react';
import faSearch from '../../assets/ClientPage/faSearch.svg';
import styles from './SearchClient.module.css';

interface Props {
  placeholder?: string;
  onSearch: (term: string) => void;
}

export function SearchClient({ placeholder = 'Wyszukaj klienta', onSearch }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className={styles['search-client']}>
      <img src={faSearch} alt="Search Icon" className={styles['search-icon']} />
      <input
        type="text"
        placeholder={placeholder}
        className={styles['searchInput']}
        onChange={handleChange}
      />
    </div>
  );
}
