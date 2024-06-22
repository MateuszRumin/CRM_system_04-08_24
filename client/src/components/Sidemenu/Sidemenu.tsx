import { NavLink } from 'react-router-dom'
import styles from './Sidemenu.module.css'

const menuItems = [
	{
		name: 'Strona główna',
		path: '/strona-glowna',
		icon: 'home.svg',
	},
	{
		name: 'Kreator',
		path: '/kreator',
		icon: 'Add_To_Queue.svg',
	},
	{
		name: 'Faktury',
		path: '/faktury',
		icon: 'Note.svg',
	},
	{
		name: 'Umowy',
		path: '/umowy',
		icon: 'Notebook.svg',
	},
	{
		name: 'Projekty',
		path: '/projekty',
		icon: 'Vector.svg',
	},
	{
		name: 'Pracownicy',
		path: '/pracownicy',
		icon: 'Users_Group.svg',
	},
	{
		name: 'Uprawnienia',
		path: '/uprawnienia',
		icon: 'Shield_Warning.svg',
	},
	{
		name: 'Klienci',
		path: '/klienci',
		icon: 'Customer.svg',
	},
]

export const Sidemenu = () => {
	return (
		<ul className={styles.sidemenu}>
			{menuItems.map(item => {
				return (
					<li key={item.path}>
						<NavLink className={styles.item} to={item.path}>
							<img
								className={styles.iconItem}
								
								src={`/menu_icons/${item.icon}`}
								alt={item.name}
							/>
							<span>{item.name}</span>
						</NavLink>
					</li>
				)
			})}
		</ul>
	)
}
