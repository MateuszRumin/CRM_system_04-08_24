import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  itemsPerPageOptions: number[];
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
  changeItemsPerPage: (newItemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  itemsPerPageOptions,
  itemsPerPage,
  totalItems,
  currentPage,
  paginate,
  changeItemsPerPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeItemsPerPage(parseInt(e.target.value));
    paginate(1); // Reset to the first page when changing items per page
  };

  return (
    <nav className={styles.paginationContainer}>
      <div className={styles.itemsPerPage}>
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <span className={styles.itemsPerPageText}> / na stronę</span>
      </div>
      <div className={styles.pagination}>
        <span className={styles.itemsPerPageText}>Poprzednia</span>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`${styles.pageLink} ${currentPage === number ? styles.active : ''}`}
          >
            {number}
          </button>
        ))}
        <span className={styles.itemsPerPageText}>Następna</span>
      </div>
    </nav>
  );
};

export default Pagination;
