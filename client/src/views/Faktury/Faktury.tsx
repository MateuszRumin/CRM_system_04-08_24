import React, { useState, useEffect } from 'react';
import styles from './Faktury.module.css';
import invoices from '../../data/invoices';
import ThreeDotIcon from '../../../public/icons/3dot.svg';
import SortIcon from '../../../public/icons/bxs_sort-alt.svg';

interface Invoice {
	number: string;
	client: string;
	type: string;
	issueDate: string;
	dueDate: string;
	amount: string;
	paymentStatus: string;
	[key: string]: string; // Indeksowy typ dla stringów
  }

export const Faktury = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices); // Użycie interfejsu Invoice
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [openedInvoiceMenu, setOpenedInvoiceMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemsPerPageOptions = [10, 20, 30, 50];
  const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice, direction: string }>({ key: 'number', direction: 'asc' }); // Klucz jako keyof Invoice

  useEffect(() => {
    const results = invoices.filter(invoice =>
      invoice.client.toLowerCase().includes(searchText.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredInvoices(results);
    setCurrentPage(1); // Reset to the first page when search text changes
  }, [searchText]);

  const toggleInvoiceMenu = (invoiceNumber: string) => {
    setOpenedInvoiceMenu(openedInvoiceMenu === invoiceNumber ? null : invoiceNumber);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const getStatusCellStyle = (status: string) => {
    switch (status) {
      case 'Nieopłacona':
        return styles.Nieoplacona;
      case 'Opłacona':
        return styles.Oplacona;
      case 'Oczekuje na płatność':
        return styles.OczekujeNaPlatnosc;
      default:
        return '';
    }
  };

  const sortTable = (key: keyof Invoice) => {
	let direction = 'asc';
	if (sortConfig.key === key && sortConfig.direction === 'asc') {
	  direction = 'desc';
	}
	setSortConfig({ key, direction });
  
	// Definicja priorytetów dla różnych typów
	const priorityOrder: Record<keyof Invoice, number> = {
	  'Oczekuje na płatność': 1,
	  'Nieopłacona': 2,
	  'Opłacona': 3
	};
  
	// Kopiowanie danych, aby nie modyfikować stanu bezpośrednio
	let sortedInvoices = [...filteredInvoices];
  
	sortedInvoices.sort((a, b) => {
	  if (key === 'type' || key === 'paymentStatus') {
		// Sortowanie specyficzne dla "Rodzaj Faktury" i "Status płatności"
		const valueA = priorityOrder[a[key] as keyof Invoice];
		const valueB = priorityOrder[b[key] as keyof Invoice];
  
		if (valueA < valueB) {
		  return direction === 'asc' ? -1 : 1;
		}
		if (valueA > valueB) {
		  return direction === 'asc' ? 1 : -1;
		}
		return 0;
	  } else {
		// Dla innych kluczy używamy domyślnego sortowania alfabetycznego
		const valueA = a[key];
		const valueB = b[key];
  
		if (valueA < valueB) {
		  return direction === 'asc' ? -1 : 1;
		}
		if (valueA > valueB) {
		  return direction === 'asc' ? 1 : -1;
		}
		return 0;
	  }
	});
  
	setFilteredInvoices(sortedInvoices);
  };

  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  return (
    <div className={styles.body}>
      <div className={styles.topbar}>
        <div className={styles.title}>Faktury</div>
        <div className={styles.controls}>
          <div className={styles.search_box}>
            <img src="/icons/search.svg" alt="Search" className={styles.icon} />
            {isSearchActive ? (
              <input
                type="text"
                className={styles.search_input}
                value={searchText}
                onChange={handleSearchChange}
                onBlur={() => setIsSearchActive(false)}
                autoFocus
              />
            ) : (
              <div className={styles.search_text} onClick={() => setIsSearchActive(true)}>
                Wyszukaj Fakturę...
              </div>
            )}
          </div>
          <button className={styles.filter_box}>
            <img src="/icons/filter.svg" alt="Filter" className={styles.icon} />
            <div className={styles.filter_text}>Filtruj</div>
          </button>
          <button className={styles.create_button}>
            <div className={styles.create_text}>Stwórz nową Fakturę</div>
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
			<th>
				<div className={styles.headerCell} onClick={() => sortTable('number')}>
					Numer faktury
					<img
					src={SortIcon}
					alt="Sort"
					className={`${styles.sortIcon} ${
						sortConfig.key === 'number' ? (sortConfig.direction === 'desc' ? styles.desc : '') : ''
					}`}
					/>
				</div>
				</th>
				<th>
				<div className={styles.headerCell} onClick={() => sortTable('client')}>
					Klient
					<img
					src={SortIcon}
					alt="Sort"
					className={`${styles.sortIcon} ${
						sortConfig.key === 'client' ? (sortConfig.direction === 'desc' ? styles.desc : '') : ''
					}`}
					/>
				</div>
				</th>
				<th>
				<div className={styles.headerCell} onClick={() => sortTable('type')}>
					Rodzaj Faktury
					<img
					src={SortIcon}
					alt="Sort"
					className={`${styles.sortIcon} ${
						sortConfig.key === 'type' ? (sortConfig.direction === 'desc' ? styles.desc : '') : ''
					}`}
					/>
				</div>
				</th>
				<th>
				<div className={styles.headerCell} onClick={() => sortTable('issueDate')}>
					Data Wystawienia
					<img
					src={SortIcon}
					alt="Sort"
					className={`${styles.sortIcon} ${
						sortConfig.key === 'issueDate' ? (sortConfig.direction === 'desc' ? styles.desc : '') : ''
					}`}
					/>
				</div>
				</th>
				<th>
				<div className={styles.headerCell} onClick={() => sortTable('dueDate')}>
					Termin płatności
					<img
					src={SortIcon}
					alt="Sort"
					className={`${styles.sortIcon} ${
						sortConfig.key === 'dueDate' ? (sortConfig.direction === 'desc' ? styles.desc : '') : ''
					}`}
					/>
				</div>
				</th>
				<th>
				<div className={styles.headerCell} onClick={() => sortTable('amount')}>
					Kwota
					<img
					src={SortIcon}
					alt="Sort"
					className={`${styles.sortIcon} ${
						sortConfig.key === 'amount' ? (sortConfig.direction === 'desc' ? styles.desc : '') : ''
					}`}
					/>
				</div>
				</th>
				<th>
				<div className={styles.headerCell} onClick={() => sortTable('paymentStatus')}>
					Status płatności
					<img
					src={SortIcon}
					alt="Sort"
					className={`${styles.sortIcon} ${
						sortConfig.key === 'paymentStatus' ? (sortConfig.direction === 'desc' ? styles.desc : '') : ''
					}`}
					/>
				</div>
				</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.map((invoice, index) => (
              <tr
                key={index}
                className={hoveredRow === index ? styles.rowHovered : styles.row}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td>{invoice.number}</td>
                <td>{invoice.client}</td>
                <td>{invoice.type}</td>
                <td>{invoice.issueDate}</td>
                <td>{invoice.dueDate}</td>
                <td>{invoice.amount}</td>
                <td>
                  <div className={`${styles.statusCell} ${getStatusCellStyle(invoice.paymentStatus)}`}>
                    {invoice.paymentStatus}
                  </div>
                </td>
                <td>
                  <div className={styles.actionsContainer}>
                    <button
                      className={styles.actionButton}
                      onClick={() => toggleInvoiceMenu(invoice.number)}
                    >
                      <img src={ThreeDotIcon} alt="Options" className={styles.iconSmall} />
                    </button>
                    {openedInvoiceMenu === invoice.number && (
                      <div className={styles.menu}>
                        <div className={styles.menuItem}>Edytuj</div>
                        <div className={styles.menuItem}>Usuń</div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.paginationContainer}>
        <div className={styles.itemsPerPage}>
          <select value={itemsPerPage} onChange={(e) => changeItemsPerPage(parseInt(e.target.value))}>
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span className={styles.itemsPerPageText}> / na stronę</span>
        </div>
        <div className={styles.pagination}>
          <span className={styles.itemsPerPageText}>Poprzednia</span>
          {Array.from({ length: Math.ceil(filteredInvoices.length / itemsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`${styles.pageLink} ${currentPage === i + 1 ? styles.active : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <span className={styles.itemsPerPageText}>Następna</span>
        </div>
      </div>
        {openedInvoiceMenu !== null && (
          <div className={styles.absoluteMenu}>
            <div className={styles.menu}>
              <div className={styles.menuItem}>Edytuj</div>
              <div className={styles.menuItem}>Usuń</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Faktury;
