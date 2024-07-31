import { useState } from 'react'
import styles from './Uprawnienia.module.css'
import { Roles } from '../../components/Roles/Roles'
import { modulesAndRoles } from '../../data/rolesAndPermissions'
import { Fragment } from 'react'

export const Uprawnienia = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [{ modul, role }, setModules] = useState(modulesAndRoles)

	const rolesAcces = role.map(r => {
		return r.roles.map(r => {
			return r.access
		})
	})

	return (
		<div className={styles.body}>
			<div>
				{/* Topbar */}
				<div className={styles.topbar}>
					<div className={styles.title}>Uprawnienia</div>
					<div className={styles.controls}>
						<button className={styles.create_button} onClick={() => setIsModalOpen(true)}>
							<div className={styles.create_text}>Stwórz nową Role</div>
						</button>
					</div>
				</div>

				<div className={styles.tableContainer}>
					<div className={styles.tableContent}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>Moduł:</th>

									{role.map(modul => (
										<th key={modul.id_role}>
											<span className={styles.headerCell}>
												{modul.name}
												<img src="/otherIcon/Note_Edit.svg" alt="Sort" className={styles.sortIcon} />
											</span>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{modul.map(modul => (
									<Fragment key={modul.id_module}>
										{modul.main ? (
											<tr>
												<td colSpan={role.length + 1} className={styles.mainModules}>
													{modul.name}
												</td>
											</tr>
										) : (
											<tr className={styles.checkbox}>
												<td className={styles.permissions}>{modul.name}</td>

												{role.map(r => (
													<td key={r.id_role}>
														<input type="checkbox" />
													</td>
												))}
											</tr>
										)}
									</Fragment>
								))}
							</tbody>
						</table>
					</div>
				</div>
				{/* Modal */}
				{isModalOpen && <Roles onClose={() => setIsModalOpen(false)} />}
			</div>
		</div>
	)
}
