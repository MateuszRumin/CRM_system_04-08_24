import React, { useState } from 'react'
import styles from './Roles.module.css'

interface RolesProps {
	onClose: () => void
}

export const Roles: React.FC<RolesProps> = ({ onClose }) => {
	const [roleName, setRoleName] = useState('')
	const [selectedModules, setSelectedModules] = useState<string[]>([])
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [errors, setErrors] = useState<{ roleName: string; modules: string }>({
		roleName: '',
		modules: '',
	})

	const modules = ['modul_1', 'modul_2', 'modul_3', 'modul_1', 'modul_2', 'modul_3', 'modul_1', 'modul_2', 'modul_3']

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}

	const handleCheckboxChange = (module: string) => {
		if (selectedModules.includes(module)) {
			setSelectedModules(selectedModules.filter(m => m !== module))
		} else {
			setSelectedModules([...selectedModules, module])
		}
	}

	const handleSave = () => {
		let valid = true
		const newErrors = { roleName: '', modules: '' }

		if (!roleName) {
			newErrors.roleName = 'Nazwa roli jest wymagana.'
			valid = false
		}

		if (selectedModules.length === 0) {
			newErrors.modules = 'Musisz zaznaczyć co najmniej jeden moduł.'
			valid = false
		}

		setErrors(newErrors)

		if (valid) {
			const obj = { nameRole: roleName, modules: [selectedModules], action: 'addNewRole' }
			console.log(obj)

			//Tutaj obsłuż wysyłanie nowej roli do serwera

			//Po otrzymaniu potwierdzenia trzeba wysłać kolejne zapyanie do serwera zaby pobrać role i uprawnienia.

			onClose()
		}
	}

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<h2>Nowa rola</h2>

				<div className={styles.content}>
					<div className={styles.dropdownButton}>
						{errors.roleName && <span className={styles.error}>{errors.roleName}</span>}
						<label>Podaj nazwę roli:</label>
						<input type="text" value={roleName} onChange={e => setRoleName(e.target.value)} />
					</div>

					<div>
						<div className={styles.dropdownButton}>
							{errors.modules && <span className={styles.error}>{errors.modules}</span>}
							<label>Lista modułów</label>
							<button onClick={toggleDropdown}>{isDropdownOpen ? 'Zamknij listę' : 'Otwórz listę'}</button>
						</div>
						<div className={styles.contentModules}>
							{isDropdownOpen && (
								<ul className={styles.dropdownList}>
									{modules.map(module => (
										<li key={module}>
											<label className={styles.labelModules}>
												<input
													className={styles.inputModules}
													type="checkbox"
													checked={selectedModules.includes(module)}
													onChange={() => handleCheckboxChange(module)}
												/>
												{module}
											</label>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>

				<div className={styles.buttons}>
					<button onClick={onClose}>Zamknij</button>
					<button onClick={handleSave}>Zapisz</button>
				</div>
			</div>
		</div>
	)
}
