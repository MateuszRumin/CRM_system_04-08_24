import { Logo } from '../Logo/Logo'
import { Sidemenu } from '../Sidemenu/Sidemenu'
import styles from './Sidebar.module.css'
export const Sidebar = () => {
	return (
		<div className={styles.sidebarContent}>
			<Logo />
			<Sidemenu />
		</div>
	)
}
