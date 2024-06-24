import faSearch from '../../assets/ClientPage/faSearch.svg';
import styles from './SearchClient.module.css'; // Importuj style CSS Modules

interface Props {
  placeholder?: string;
}

export function SearchClient({ placeholder = 'Wyszukaj klienta' }: Props) {
  return (
    <div className={styles['search-client']}>
      <img src={faSearch} alt="Search Icon" className={styles['search-icon']} />
      <input
        type="text"
        placeholder={placeholder}
        className={styles['searchInput']}
      />
    </div>
  );
}
