import styles from './Logo.module.css'

export const Logo = () => {
	return (
		<>
			<div className={styles.logo}>
				<img src="/logo/logo.svg" alt="Logo firmy, składające się z ikony oraz nazwy firmy" />
			</div>
		</>
	)
}
