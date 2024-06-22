import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs'
import styles from './Topbar.module.css'

export const Topbar = () => {
	return (
		<div className={styles.topbar}>
			<Breadcrumbs />
		</div>
	)
}
