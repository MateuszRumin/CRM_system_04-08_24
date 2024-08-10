import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Umowy.module.css';
import contracts from '../../data/contracts';
import ThreeDotIcon from '../../../public/icons/3dot.svg';
import SortIcon from '../../../public/icons/bxs_sort-alt.svg';
import FilterSettingsModal from '../../components/Invoice/FilterSettingsModal';
import NewContractForm from '../../components/Invoice/NewInvoiceForm';

export const Umowy = () => {

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredContracts, setFilteredContracts] = useState(contracts);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [openedContractMenu, setOpenedContractMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortTypeForNumber, setSortTypeForNumber] = useState<'asc' | 'desc' | null>(null);
  const [sortTypeForClient, setSortTypeForClient] = useState<'asc' | 'desc' | null>(null);
  const [sortTypeForProject, setSortTypeForProject] = useState<'asc' | 'desc' | null>(null);
  const [sortTypeForCreationDate, setSortTypeForCreationDate] = useState<'asc' | 'desc' | null>(null);
  const [sortTypeForSendDate, setSortTypeForSendDate] = useState<'asc' | 'desc' | null>(null);
  const [sortTypeForDueDate, setSortTypeForDueDate] = useState<'asc' | 'desc' | null>(null);
  const [sortTypeForSignatureStatus, setSortTypeForSignatureStatus] = useState<1 | 2 | 3>(1); // 1 - Podpisana, 2 - Oczekuje na podpis, 3 - Niepodpisana

  const itemsPerPageOptions = [10, 20, 30, 50];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewContractFormOpen, setIsNewContractFormOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNewContractClick = () => {
    setIsNewContractFormOpen(true);
  };

  const closeNewContractForm = () => {
    setIsNewContractFormOpen(false);
  };

  useEffect(() => {
    const results = contracts.filter(contract =>
      contract.client.toLowerCase().includes(searchText.toLowerCase()) ||
      contract.agreementNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      contract.project.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredContracts(results);
    setCurrentPage(1); // Reset to the first page when search text changes
  }, [searchText]);

  const toggleContractMenu = (contractNumber: string) => {
    setOpenedContractMenu(openedContractMenu === contractNumber ? null : contractNumber);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const getStatusCellStyle = (status: string) => {
    switch (status) {
      case 'Niepodpisana':
        return styles.Niepodpisana;
      case 'Podpisana':
        return styles.Podpisana;
      case 'Oczekuje na podpis':
        return styles.OczekujeNaPodpis;
      default:
        return '';
    }
  };

  const sortByNumber = () => {
    let sortedContracts = [...filteredContracts];
    if (sortTypeForNumber === 'asc') {
      sortedContracts.sort((a, b) => a.agreementNumber.localeCompare(b.agreementNumber));
      setSortTypeForNumber('desc');
    } else {
      sortedContracts.sort((a, b) => b.agreementNumber.localeCompare(a.agreementNumber));
      setSortTypeForNumber('asc');
    }
    setFilteredContracts(sortedContracts);
  };

  const sortByClient = () => {
    let sortedContracts = [...filteredContracts];
    if (sortTypeForClient === 'asc') {
      sortedContracts.sort((a, b) => a.client.localeCompare(b.client));
      setSortTypeForClient('desc');
    } else {
      sortedContracts.sort((a, b) => b.client.localeCompare(a.client));
      setSortTypeForClient('asc');
    }
    setFilteredContracts(sortedContracts);
  };

  const sortByProject = () => {
    let sortedContracts = [...filteredContracts];
    if (sortTypeForProject === 'asc') {
      sortedContracts.sort((a, b) => a.project.localeCompare(b.project));
      setSortTypeForProject('desc');
    } else {
      sortedContracts.sort((a, b) => b.project.localeCompare(a.project));
      setSortTypeForProject('asc');
    }
    setFilteredContracts(sortedContracts);
  };

  const sortByCreationDate = () => {
    let sortedContracts = [...filteredContracts];
    if (sortTypeForCreationDate === 'asc') {
      sortedContracts.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
      setSortTypeForCreationDate('desc');
    } else {
      sortedContracts.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
      setSortTypeForCreationDate('asc');
    }
    setFilteredContracts(sortedContracts);
  };

  const sortBySendDate = () => {
    let sortedContracts = [...filteredContracts];
    if (sortTypeForSendDate === 'asc') {
      sortedContracts.sort((a, b) => new Date(a.sentDate).getTime() - new Date(b.sentDate).getTime());
      setSortTypeForSendDate('desc');
    } else {
      sortedContracts.sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime());
      setSortTypeForSendDate('asc');
    }
    setFilteredContracts(sortedContracts);
  };

  const sortByDueDate = () => {
    let sortedContracts = [...filteredContracts];
    if (sortTypeForDueDate === 'asc') {
      sortedContracts.sort((a, b) => new Date(a.signingDeadline).getTime() - new Date(b.signingDeadline).getTime());
      setSortTypeForDueDate('desc');
    } else {
      sortedContracts.sort((a, b) => new Date(b.signingDeadline).getTime() - new Date(a.signingDeadline).getTime());
      setSortTypeForDueDate('asc');
    }
    setFilteredContracts(sortedContracts);
  };

  const sortBySignatureStatus = () => {
    let sortedContracts = [...filteredContracts];
    switch (sortTypeForSignatureStatus) {
      case 1:
        sortedContracts.sort((a, b) => {
          if (a.signingStatus === 'Podpisana') return -1;
          if (b.signingStatus === 'Podpisana') return 1;
          return 0;
        });
        setSortTypeForSignatureStatus(2);
        break;
      case 2:
        sortedContracts.sort((a, b) => {
          if (a.signingStatus === 'Oczekuje na podpis') return -1;
          if (b.signingStatus === 'Oczekuje na podpis') return 1;
          return 0;
        });
        setSortTypeForSignatureStatus(3);
        break;
      case 3:
        sortedContracts.sort((a, b) => {
          if (a.signingStatus === 'Niepodpisana') return -1;
          if (b.signingStatus === 'Niepodpisana') return 1;
          return 0;
        });
        setSortTypeForSignatureStatus(1);
        break;
      default:
        break;
    }
    setFilteredContracts(sortedContracts);
  };

  const indexOfLastContract = currentPage * itemsPerPage;
  const indexOfFirstContract = indexOfLastContract - itemsPerPage;
  const currentContracts = filteredContracts.slice(indexOfFirstContract, indexOfLastContract);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  return (
    <div className={styles.body}>
      
        <div>
          {/* Topbar */}
          <div className={styles.topbar}>
            <div className={styles.title}>Umowy</div>
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
                    Wyszukaj Umowę...
                  </div>
                )}
              </div>
			  <button className={styles.filter_box} onClick={openModal}>
				<img src="/icons/filter.svg" alt="Filter" className={styles.icon} />
				<div className={styles.filter_text}>Filtruj</div>
			</button>
			<Link to="/umowy/new" className={styles.create_button}>
				<div className={styles.create_text}>Stwórz nową Umowę</div>
			</Link>
            </div>
          </div>

          {/* Contract Table */}
          <div className={styles.contract_table}>
		  <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={sortByNumber} >
					<div className={styles.headerCell}>
					Numer umowy <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
					</div>
                </th>
                <th onClick={sortByClient}>
					<div className={styles.headerCell}>
					Klient <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
					</div>
                </th>
                <th onClick={sortByProject} className={styles.clickable}>
					<div className={styles.headerCell}>
					Projekt <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
					</div>
                </th>
                <th onClick={sortByCreationDate} className={styles.clickable}>
					<div className={styles.headerCell}>
					Data stworzenia <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
					</div>
                </th>
                <th onClick={sortBySendDate} className={styles.clickable}>
					<div className={styles.headerCell}>
					Data wysłnia <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
					</div>
                </th>
                <th onClick={sortByDueDate} className={styles.clickable}>
					<div className={styles.headerCell}>
					Termin realizacji <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
					</div>
                </th>
                <th onClick={sortBySignatureStatus} className={styles.clickable}>
				<div className={styles.headerCell}>
                  Status podpisu <img src={SortIcon} alt="Sort" className={styles.sortIcon} />
                </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentContracts.map((contract, index) => (
                <tr
                  key={contract.agreementNumber}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={hoveredRow === index ? styles.rowHovered : ''}
                >
                  <td>{contract.agreementNumber}</td>
                  <td>{contract.client}</td>
                  <td>{contract.project}</td>
                  <td>{new Date(contract.creationDate).toLocaleDateString()}</td>
                  <td>{new Date(contract.sentDate).toLocaleDateString()}</td>
                  <td>{new Date(contract.signingDeadline).toLocaleDateString()}</td>
                  <td>
                  <div className={`${styles.statusCell} ${getStatusCellStyle(contract.signingStatus)}`}>
                    {contract.signingStatus}
                  </div>
                </td>

                  <td>
                    <img
                      src={ThreeDotIcon}
                      alt="More"
                      className={styles.more_icon}
                      onClick={() => toggleContractMenu(contract.agreementNumber)}
                    />
                    {openedContractMenu === contract.agreementNumber && (
                      <div className={styles.menu}>
                        <div className={styles.menuItem}>Zobacz</div>
                        <div className={styles.menuItem}>Edytuj</div>
                        <div className={styles.menuItem}>Usuń</div>
                      </div>
                    )}
                  </td>
				  <td>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
		  </div>

          {/* Pagination */}
		  <div className={styles.paginationContainer}>
			<div className={styles.itemsPerPage}>
				<select value={itemsPerPage} onChange={(e) => changeItemsPerPage(parseInt(e.target.value, 10))}>
				{itemsPerPageOptions.map(option => (
					<option key={option} value={option}>{option}</option>
				))}
				</select>
				<span className={styles.itemsPerPageText}> / na stronę</span>
			</div>
			<div className={styles.pagination}>
				<span className={styles.itemsPerPageText} onClick={() => currentPage > 1 && paginate(currentPage - 1)}>Poprzednia</span>
				{Array.from({ length: Math.ceil(filteredContracts.length / itemsPerPage) }, (_, index) => (
				<button
					key={index + 1}
					onClick={() => paginate(index + 1)}
					className={`${styles.pageLink} ${index + 1 === currentPage ? styles.active : ''}`}
				>
					{index + 1}
				</button>
				))}
				<span className={styles.itemsPerPageText} onClick={() => currentPage < Math.ceil(filteredContracts.length / itemsPerPage) && paginate(currentPage + 1)}>Następna</span>
			</div>
			</div>


          {/* Filter Settings Modal */}
          {isModalOpen && <FilterSettingsModal onClose={closeModal} />}
        </div>
      
    </div>
  );
};

export default Umowy;
