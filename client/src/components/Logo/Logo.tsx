import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

export const Logo = () => {
	return (
		<>
			<div className={styles.logo}>
				<Link to="/">
					<img src="/logo/logo.svg" alt="Logo firmy, składające się z ikony oraz nazwy firmy" />
				</Link>
			</div>
		</>
	)
}
