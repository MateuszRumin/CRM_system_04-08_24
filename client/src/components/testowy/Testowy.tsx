import { useState } from 'react'
import styles from './Testowy.module.css'
export const Testowy = () => {
	// Inicjalizacja stanu
	const [rows, setRows] = useState([
		{ id: 1, col1: 'Dane 1', col2: 'Dane 2', col3: 'Dane 3', showNewButton: false },
		{ id: 2, col1: 'Dane 4', col2: 'Dane 5', col3: 'Dane 6', showNewButton: false },
		{ id: 3, col1: 'Dane 7', col2: 'Dane 8', col3: 'Dane 9', showNewButton: false },
		{ id: 4, col1: 'Dane 10', col2: 'Dane 11', col3: 'Dane 12', showNewButton: false },
		{ id: 5, col1: 'Dane 13', col2: 'Dane 14', col3: 'Dane 15', showNewButton: false },
	])

	// Funkcja obsługująca kliknięcie przycisku 'Pokaż'
	const handleShowClick = id => {
		setRows(rows.map(row => (row.id === id ? { ...row, showNewButton: !row.showNewButton } : row)))
	}

	return (
		<table>
			<thead>
				<tr>
					<th>Kolumna 1</th>
					<th>Kolumna 2</th>
					<th>Kolumna 3</th>
					<th>Akcje</th>
				</tr>
			</thead>
			<tbody>
				{rows.map(row => (
					<tr key={row.id}>
						<td>{row.col1}</td>
						<td>{row.col2}</td>
						<td>{row.col3}</td>
						<td>
							<button onClick={() => handleShowClick(row.id)}>Pokaż</button>
							{row.showNewButton && (
								<div className={styles.menu}>
									<div className={styles.menuItem}>Edytuj</div>
									<div className={styles.menuItem}>Usuń</div>
								</div>
							)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
