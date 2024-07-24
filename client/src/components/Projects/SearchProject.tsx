import React, { useState } from 'react';
import styles from './SearchProject.module.css';
import faSearch from '../../assets/ClientPage/faSearch.svg'; 

interface SearchProjectProps {
  onSearch: (term: string) => void;
}

export const SearchProject: React.FC<SearchProjectProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className={styles.searchContainer}>
      <img src={faSearch} alt="Search Icon" className={styles.searchIcon} />
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Szukaj projektów..."
        className={styles.searchInput}
      />
    </div>
  );
};
