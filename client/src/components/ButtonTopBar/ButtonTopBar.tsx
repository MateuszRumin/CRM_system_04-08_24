import { NavLink } from 'react-router-dom'
import styles from './ButtonTopBar.module.css'
interface ButtonTopBarProps {
	src: string
	alt: string
	path: string
	onClick: () => void
}

export const ButtonTopBar = ({ src, alt, path = '', onClick }: ButtonTopBarProps) => {
	if (path !== '') {
		return (
			<NavLink to={path}>
				<button onClick={onClick} className={styles.buttontopbar}>
					<img src={src} alt={alt} />
				</button>
			</NavLink>
		)
	}

	return (
		<>
			<button onClick={onClick} className={styles.buttontopbar}>
				<img src={src} alt={alt} />
			</button>
		</>
	)
}
