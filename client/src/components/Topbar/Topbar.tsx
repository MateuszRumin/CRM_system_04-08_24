import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs'
import { Logout } from '../Logout/Logout'
import { Notifications } from '../Notifications/Notifications'
import { Profile } from '../Profile/Profile'
import { Settings } from '../Settings/Settings'
import styles from './Topbar.module.css'

export const Topbar = () => {
	return (
		<header className={styles.topbar}>
			<Breadcrumbs />

			<section className={styles.topbaricons}>
				<section>
					<Logout />
					<Settings />
					<Notifications />
				</section>
				<Profile />
			</section>
		</header>
	)
}
