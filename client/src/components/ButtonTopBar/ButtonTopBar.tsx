import styles from './ButtonTopBar.module.css'
interface ButtonTopBarProps {
	src: string
	alt: string
	onClick: () => void
}

export const ButtonTopBar = ({ src, alt, onClick }: ButtonTopBarProps) => {
	return (
		<>
			<button onClick={onClick} className={styles.buttontopbar}>
				<img src={src} alt={alt} />
			</button>
		</>
	)
}
