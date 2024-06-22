import styles from './MainContent.module.css'


interface MainContents {
	children: React.ReactNode
}

export const MainContent = ({ children }: MainContents) => {
	return <div className={styles.mainContent}>{children}</div>
}
