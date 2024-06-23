import profile from '../../assets/TopBarIcons/profile.png'
import styles from './Profile.module.css'
export const Profile = () => {
	const openModal = () => {
		console.log('Profil')
	}

	return (
		<div className={styles.profile}>
			<span>Jan Kowalski </span>
			<button onClick={openModal} className={styles.btnProfile}>
				<img src={profile} alt="zdjecie profilowe" />
			</button>
		</div>
	)
}
