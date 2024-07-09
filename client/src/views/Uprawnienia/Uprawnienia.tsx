import { useState } from 'react'
import styles from './Uprawnienia.module.css'

export const Uprawnienia = () => {
	const [isSearchActive, setIsSearchActive] = useState(false)
	const [searchText, setSearchText] = useState('')

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value)
	}
	return (
		<>
			<div className={styles.topbar}>
				<div className={styles.title}>Role</div>
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
								Wyszukaj Role...
							</div>
						)}
					</div>
					<button className={styles.filter_box}>
				
						<div className={styles.filter_text}>Dodaj role</div>
					</button>
					<button className={styles.create_button}>
						<div className={styles.create_text}>Zapisz role</div>
					</button>
				</div>
			</div>
		</>
	)
}
