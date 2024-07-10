import { useEffect, useState } from 'react'
import styles from './Uprawnienia.module.css'
import invoices from '../../data/invoices'
import FilterSettingsModal from '../../components/Invoice/FilterSettingsModal'
import rolesData from '../../data/rolesData'
export const Uprawnienia = () => {
	const [searchText, setSearchText] = useState('')
	const [filteredInvoices, setFilteredInvoices] = useState(invoices)
	const [hoveredRow, setHoveredRow] = useState<number | null>(null)
	const [openedInvoiceMenu, setOpenedInvoiceMenu] = useState<string | null>(null)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [itemsPerPage, setItemsPerPage] = useState<number>(10)
	const [sortTypeForNumber, setSortTypeForNumber] = useState<'asc' | 'desc' | null>(null)
	const [sortTypeForClient, setSortTypeForClient] = useState<'asc' | 'desc' | null>(null)
	const [sortTypeForType, setSortTypeForType] = useState<1 | 2 | 3>(1) // 1 - VAT, 2 - Zaliczka, 3 - Końcowa
	// 1 - Opłacona, 2 - Oczekuje na płatność, 3 - Nieopłacona
	const [sortTypeForInvoiceStatus, setSortTypeForInvoiceStatus] = useState<'asc' | 'desc' | null>(null) // Dodane

	const itemsPerPageOptions = [10, 20, 30, 50]

	const [isModalOpen, setIsModalOpen] = useState(false)

	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
	}

	useEffect(() => {
		const results = invoices.filter(
			invoice =>
				invoice.client.toLowerCase().includes(searchText.toLowerCase()) ||
				invoice.number.toLowerCase().includes(searchText.toLowerCase())
		)
		setFilteredInvoices(results)
		setCurrentPage(1) // Reset to the first page when search text changes
	}, [searchText])

	const toggleInvoiceMenu = (invoiceNumber: string) => {
		setOpenedInvoiceMenu(openedInvoiceMenu === invoiceNumber ? null : invoiceNumber)
	}

	const sortByNumber = () => {
		let sortedInvoices = [...filteredInvoices]
		if (sortTypeForNumber === 'asc') {
			sortedInvoices.sort((a, b) => a.number.localeCompare(b.number))
			setSortTypeForNumber('desc')
		} else {
			sortedInvoices.sort((a, b) => b.number.localeCompare(a.number))
			setSortTypeForNumber('asc')
		}
		setFilteredInvoices(sortedInvoices)
	}

	const sortByClient = () => {
		let sortedInvoices = [...filteredInvoices]
		if (sortTypeForClient === 'asc') {
			sortedInvoices.sort((a, b) => a.client.localeCompare(b.client))
			setSortTypeForClient('desc')
		} else {
			sortedInvoices.sort((a, b) => b.client.localeCompare(a.client))
			setSortTypeForClient('asc')
		}
		setFilteredInvoices(sortedInvoices)
	}

	const sortByType = () => {
		let sortedInvoices = [...filteredInvoices]
		switch (sortTypeForType) {
			case 1:
				sortedInvoices.sort((a, b) => {
					if (a.type === 'VAT') return -1
					if (b.type === 'VAT') return 1
					return 0
				})
				setSortTypeForType(2)
				break
			case 2:
				sortedInvoices.sort((a, b) => {
					if (a.type === 'Zaliczka') return -1
					if (b.type === 'Zaliczka') return 1
					return 0
				})
				setSortTypeForType(3)
				break
			case 3:
				sortedInvoices.sort((a, b) => {
					if (a.type === 'Końcowa') return -1
					if (b.type === 'Końcowa') return 1
					return 0
				})
				setSortTypeForType(1)
				break
			default:
				break
		}
		setFilteredInvoices(sortedInvoices)
	}

	const sortByInvoiceStatus = () => {
		let sortedInvoices = [...filteredInvoices]
		if (sortTypeForInvoiceStatus === 'asc') {
			sortedInvoices.sort((a, b) => a.invoiceStatus.localeCompare(b.invoiceStatus))
			setSortTypeForInvoiceStatus('desc')
		} else {
			sortedInvoices.sort((a, b) => b.invoiceStatus.localeCompare(a.invoiceStatus))
			setSortTypeForInvoiceStatus('asc')
		}
		setFilteredInvoices(sortedInvoices)
	}

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

	const changeItemsPerPage = (newItemsPerPage: number) => {
		setItemsPerPage(newItemsPerPage)
		setCurrentPage(1) // Reset to the first page when items per page changes
	}

	return (
		<div className={styles.body}>
			<div>
				{/* Topbar */}
				<div className={styles.topbar}>
					<div className={styles.title}>Uprawnienia</div>
					<div className={styles.controls}>
						<div className={styles.search_box}>
							<img src="/icons/search.svg" alt="Search" className={styles.icon} />

							<input
								type="text"
								className={styles.search_input}
								value={searchText}
								onChange={e => setSearchText(e.target.value)}
								placeholder="Wyszukaj uprawnienia..."
							/>
						</div>
						<button className={styles.filter_box} onClick={openModal}>
							<img src="/icons/filter.svg" alt="Filter" className={styles.icon} />
							<div className={styles.filter_text}>Filtruj</div>
						</button>
						<button className={styles.create_button}>
							<div className={styles.create_text}>Stwórz nową Role</div>
						</button>
						<button className={styles.create_button}>
							<div className={styles.create_text}>Stwórz nowe Uprawnienie</div>
						</button>
					</div>
				</div>

				<div className={styles.tableContainer}>
					<div className={styles.tableContent}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th onClick={sortByNumber}>
										<div className={styles.headerCell}>
											Nazwa uprawnienia <img src="/icons/bxs_sort-alt.svg" alt="Sort" className={styles.sortIcon} />
										</div>
									</th>
									<th onClick={sortByClient}>
										<div className={styles.headerCell}>
											Admin <img src="/icons/bxs_sort-alt.svg" alt="Sort" className={styles.sortIcon} />
										</div>
									</th>
									<th onClick={sortByType}>
										<div className={styles.headerCell}>
											Designer UI <img src="/icons/bxs_sort-alt.svg" alt="Sort" className={styles.sortIcon} />
										</div>
									</th>
									<th onClick={sortByInvoiceStatus}>
										<div className={styles.headerCell}>
											Programista <img src="/icons/bxs_sort-alt.svg" alt="Sort" className={styles.sortIcon} />
										</div>
									</th>
								</tr>
							</thead>
							<tbody>
								{rolesData.map((invoice, index) => (
									<tr
										key={index}
										className={hoveredRow === index ? styles.rowHovered : styles.row}
										onMouseEnter={() => setHoveredRow(index)}
										onMouseLeave={() => setHoveredRow(null)}>
										<td className={styles.permissions}>{invoice}</td>

										<td className={styles.checkbox}>
											<input type="checkbox" name="" id="" />
										</td>
										<td className={styles.checkbox}>
											<input type="checkbox" name="" id="" />
										</td>
										<td className={styles.checkbox}>
											<input type="checkbox" name="" id="" />
										</td>

										<td>
											<div className={styles.actionsContainer}>
												<button className={styles.actionButton} onClick={() => toggleInvoiceMenu(invoice)}>
													<img alt="Options" src="/icons/3dot.svg" className={styles.iconSmall} />
												</button>
												{openedInvoiceMenu === invoice && (
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
					</div>

					<div className={styles.paginationContainer}>
						<div className={styles.itemsPerPage}>
							<select value={itemsPerPage} onChange={e => changeItemsPerPage(parseInt(e.target.value))}>
								{itemsPerPageOptions.map(option => (
									<option key={option} value={option}>
										{option}
									</option>
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
									className={`${styles.pageLink} ${currentPage === i + 1 ? styles.active : ''}`}>
									{i + 1}
								</button>
							))}
							<span className={styles.itemsPerPageText}>Następna</span>
						</div>
					</div>
				</div>
				{/* Modal */}
				{isModalOpen && <FilterSettingsModal onClose={closeModal} />}
			</div>
		</div>
	)
}
