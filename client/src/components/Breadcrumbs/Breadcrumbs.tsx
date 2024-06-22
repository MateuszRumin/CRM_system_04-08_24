import { NavLink, useLocation } from 'react-router-dom'
import styles from './Breadcrumbs.module.css'
import arrow from '../../assets/Breadcrumbs/arrow.svg'

export const Breadcrumbs = () => {
	const location = useLocation()
	let breadcrumbs = location.pathname.split('/').filter(crumb => crumb !== '')

	if (breadcrumbs.length == 0) breadcrumbs = ['strona główna']
	return (
		<>
			<ul className={styles.breadcrumb}>
				{breadcrumbs.map((crumb, index) => {
					return (
						<li key={crumb}>
							<NavLink end to={crumb === 'strona główna' ? `/` : `/${breadcrumbs.slice(0, index + 1).join('/')}`}>
								{({ isActive }) => {
									return (
										<>
											<span className={isActive ? styles.active : ''}>{crumb}</span>
											<img src={arrow} />
										</>
									)
								}}
							</NavLink>
						</li>
					)
				})}
			</ul>
		</>
	)
}
