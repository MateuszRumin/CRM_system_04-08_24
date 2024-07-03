import React, { useState, useEffect } from 'react';
import styles from './Faktury.module.css';
import invoices from '../../data/invoices';
import ThreeDotIcon from '../../../public/icons/3dot.svg';
import SortIcon from '../../../public/icons/bxs_sort-alt.svg';
import FilterSettingsModal from '../../components/Invoice/FilterSettingsModal';

export const Faktury = () => {

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [openedInvoiceMenu, setOpenedInvoiceMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortTypeForNumber, setSortTypeForNumber] = useState<'asc' | 'desc' | null>(null);
  const [sortTypeForClient, setSortTypeForClient] = useState<'asc' | 'desc' | null>(null);
  const [sortTypeForType, setSortTypeForType] = useState<1 | 2 | 3>(1); // 1 - VAT, 2 - Zaliczka, 3 - Końcowa
  const [sortTypeForIssueDate, setSortTypeForIssueDate] = useState<'asc' | 'desc' | null>(null);
  const [sortTypeForDueDate, setSortTypeForDueDate] = useState<'asc' | 'desc' | null>(null);
  const [sortTypeForAmount, setSortTypeForAmount] = useState<'asc' | 'desc' | null>(null);
  const [sortTypeForPaymentStatus, setSortTypeForPaymentStatus] = useState<1 | 2 | 3>(1); // 1 - Opłacona, 2 - Oczekuje na płatność, 3 - Nieopłacona
  const [sortTypeForInvoiceStatus, setSortTypeForInvoiceStatus] = useState<'asc' | 'desc' | null>(null); // Dodane

  const itemsPerPageOptions = [10, 20, 30, 50];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  const sortByNumber = () => {
    let sortedInvoices = [...filteredInvoices];
    if (sortTypeForNumber === 'asc') {
      sortedInvoices.sort((a, b) => a.number.localeCompare(b.number));
      setSortTypeForNumber('desc');
    } else {
      sortedInvoices.sort((a, b) => b.number.localeCompare(a.number));
      setSortTypeForNumber('asc');
    }
    setFilteredInvoices(sortedInvoices);
  };

  const sortByClient = () => {
    let sortedInvoices = [...filteredInvoices];
    if (sortTypeForClient === 'asc') {
      sortedInvoices.sort((a, b) => a.client.localeCompare(b.client));
      setSortTypeForClient('desc');
    } else {
      sortedInvoices.sort((a, b) => b.client.localeCompare(a.client));
      setSortTypeForClient('asc');
    }
    setFilteredInvoices(sortedInvoices);
  };

  const sortByType = () => {
    let sortedInvoices = [...filteredInvoices];
    switch (sortTypeForType) {
      case 1:
        sortedInvoices.sort((a, b) => {
          if (a.type === 'VAT') return -1;
          if (b.type === 'VAT') return 1;
          return 0;
        });
        setSortTypeForType(2);
        break;
      case 2:
        sortedInvoices.sort((a, b) => {
          if (a.type === 'Zaliczka') return -1;
          if (b.type === 'Zaliczka') return 1;
          return 0;
        });
        setSortTypeForType(3);
        break;
      case 3:
        sortedInvoices.sort((a, b) => {
          if (a.type === 'Końcowa') return -1;
          if (b.type === 'Końcowa') return 1;
          return 0;
        });
        setSortTypeForType(1);
        break;
      default:
        break;
    }
    setFilteredInvoices(sortedInvoices);
  };

  const sortByIssueDate = () => {
    let sortedInvoices = [...filteredInvoices];
    if (sortTypeForIssueDate === 'asc') {
      sortedInvoices.sort((a, b) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime());
      setSortTypeForIssueDate('desc');
    } else {
      sortedInvoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
      setSortTypeForIssueDate('asc');
    }
    setFilteredInvoices(sortedInvoices);
  };

  const sortByDueDate = () => {
    let sortedInvoices = [...filteredInvoices];
    if (sortTypeForDueDate === 'asc') {
      sortedInvoices.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      setSortTypeForDueDate('desc');
    } else {
      sortedInvoices.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
      setSortTypeForDueDate('asc');
    }
    setFilteredInvoices(sortedInvoices);
  };

  const sortByAmount = () => {
    let sortedInvoices = [...filteredInvoices];
    if (sortTypeForAmount === 'asc') {
      sortedInvoices.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
      setSortTypeForAmount('desc');
    } else {
      sortedInvoices.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
      setSortTypeForAmount('asc');
    }
    setFilteredInvoices(sortedInvoices);
  };

  const sortByPaymentStatus = () => {
    let sortedInvoices = [...filteredInvoices];
    switch (sortTypeForPaymentStatus) {
      case 1:
        sortedInvoices.sort((a, b) => {
          if (a.paymentStatus === 'Opłacona') return -1;
          if (b.paymentStatus === 'Opłacona') return 1;
          return 0;
        });
        setSortTypeForPaymentStatus(2);
        break;
      case 2:
        sortedInvoices.sort((a, b) => {
          if (a.paymentStatus === 'Oczekuje na płatność') return -1;
          if (b.paymentStatus === 'Oczekuje na płatność') return 1;
          return 0;
        });
        setSortTypeForPaymentStatus(3);
        break;
      case 3:
        sortedInvoices.sort((a, b) => {
          if (a.paymentStatus === 'Nieopłacona') return -1;
          if (b.paymentStatus === 'Nieopłacona') return 1;
          return 0;
        });
        setSortTypeForPaymentStatus(1);
        break;
      default:
        break;
    }
    setFilteredInvoices(sortedInvoices);
  };

  const sortByInvoiceStatus = () => {
    let sortedInvoices = [...filteredInvoices];
    if (sortTypeForInvoiceStatus === 'asc') {
      sortedInvoices.sort((a, b) => a.invoiceStatus.localeCompare(b.invoiceStatus));
      setSortTypeForInvoiceStatus('desc');
    } else {
      sortedInvoices.sort((a, b) => b.invoiceStatus.localeCompare(a.invoiceStatus));
      setSortTypeForInvoiceStatus('asc');
    }
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
          <button className={styles.filter_box} onClick={openModal}>
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
              <th onClick={sortByNumber}>
                <div className={styles.headerCell}>
                  Numer faktury <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
                </div>
              </th>
              <th onClick={sortByClient}>
                <div className={styles.headerCell}>
                  Klient <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
                </div>
              </th>
              <th onClick={sortByType}>
                <div className={styles.headerCell}>
                  Rodzaj Faktury <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
                </div>
              </th>
              <th onClick={sortByInvoiceStatus}>
                <div className={styles.headerCell}>
                  Status Faktury <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
                </div>
              </th>
              <th onClick={sortByIssueDate}>
                <div className={styles.headerCell}>
                  Data Wystawienia <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
                </div>
              </th>
              <th onClick={sortByDueDate}>
                <div className={styles.headerCell}>
                  Termin płatności <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
                </div>
              </th>
              <th onClick={sortByAmount}>
                <div className={styles.headerCell}>
                  Kwota <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
                </div>
              </th>
              <th onClick={sortByPaymentStatus}>
                <div className={styles.headerCell}>
                  Status płatności <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
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
                <td>{invoice.invoiceStatus}</td>
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
      {isModalOpen && <FilterSettingsModal onClose={closeModal} />}
    </div>
  );
};

export default Faktury;
