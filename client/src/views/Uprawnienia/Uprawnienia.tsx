import { useState } from 'react'
import styles from './Uprawnienia.module.css'
import FilterSettingsModal from '../../components/Invoice/FilterSettingsModal'
import invoices from '../../data/rolesDta'
export const Uprawnienia = () => {
	const [searchText, setSearchText] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})
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
						<button className={styles.filter_box} onClick={() => setIsModalOpen(true)}>
							<img src="/icons/filter.svg" alt="Filter" className={styles.icon} />
							<div className={styles.filter_text}>Filtruj</div>
						</button>
						<button className={styles.create_button}>
							<div className={styles.create_text}>Stwórz nową Role</div>
						</button>
					</div>
				</div>

				<div className={styles.tableContainer}>
					<div className={styles.tableContent}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>
										<div className={styles.headerCell}>
											Nazwa uprawnienia <img src="/icons/bxs_sort-alt.svg" alt="Sort" className={styles.sortIcon} />
										</div>
									</th>
									<th>
										<div className={styles.headerCell}>
											Admin <img src="/icons/bxs_sort-alt.svg" alt="Sort" className={styles.sortIcon} />
										</div>
									</th>
									<th>
										<div className={styles.headerCell}>
											Designer UI <img src="/icons/bxs_sort-alt.svg" alt="Sort" className={styles.sortIcon} />
										</div>
									</th>
									<th>
										<div className={styles.headerCell}>
											Programista <img src="/icons/bxs_sort-alt.svg" alt="Sort" className={styles.sortIcon} />
										</div>
									</th>
								</tr>
							</thead>
							<tbody>
								{invoices.map((invoice, index) => (
									<tr key={index}>
										<td className={styles.permissions}>{invoice.client}</td>

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
												{/* Wysuwa to menu do konkretnego wiersza */}
												<button
													className={styles.actionButton}
													onClick={() => {
														const newOpenMenus = { ...openMenus }
														Object.keys(newOpenMenus).forEach(key => {
															if (key !== index.toString()) {
																newOpenMenus[key] = false
															}
														})
														newOpenMenus[index.toString()] = !newOpenMenus[index.toString()]
														setOpenMenus(newOpenMenus)
													}}>
													<img alt="Options" src="/icons/3dot.svg" className={styles.iconSmall} />
												</button>

												{openMenus[index.toString()] && (
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
				</div>
				{/* Modal */}
				{isModalOpen && <FilterSettingsModal onClose={() => setIsModalOpen(false)} />}
			</div>
		</div>
	)
}
