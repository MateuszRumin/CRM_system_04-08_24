import { NavLink, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';
import arrow from '../../assets/Breadcrumbs/arrow.svg';

export const Breadcrumbs = () => {
	const location = useLocation();
	let breadcrumbs = location.pathname.split('/').filter(crumb => crumb !== '');

	return (
		<>
			<ul className={styles.breadcrumb}>
				<li key="weblance-crm">
					<NavLink end to="/">
						<span className={styles.breadcrumb}>Weblance CRM</span>
						<img src={arrow} alt="separator" />
					</NavLink>
				</li>
				{breadcrumbs.map((crumb, index) => {
					return (
						<li key={crumb}>
							<NavLink end to={`/${breadcrumbs.slice(0, index + 1).join('/')}`}>
								{({ isActive }) => {
									return (
										<>
											<span className={isActive ? styles.active : ''}>{crumb}</span>
											{index < breadcrumbs.length - 1 && <img src={arrow} alt="separator" />}
										</>
									);
								}}
							</NavLink>
						</li>
					);
				})}
			</ul>
		</>
	);
};
