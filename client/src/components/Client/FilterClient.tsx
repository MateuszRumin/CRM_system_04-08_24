import faFilter from '../../assets/ClientPage/faFilter.svg';
import styles from './FilterClient.module.css';

export function FilterClient() {
  return (
    <div className={styles.filterClient}>
      <button className={styles.filterButton}>
        <img src={faFilter} alt="Filter Icon" className={styles.filterIcon} />
        Filtruj
      </button>
    </div>
  );
}
