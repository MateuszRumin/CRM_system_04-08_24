import { useState } from 'react'
import profile from '../../assets/TopBarIcons/profile.png'
import styles from './Profile.module.css'
import { ChangeDataProfile } from './ChangeDataProfile/ChangeDataProfile'

export const Profile = () => {
	const [openModal, setOpenModal] = useState(false)

	
console.log('render');
	return (
		<>
		<div className={styles.profile}>
			<span>Jan Kowalski </span>
			<button onClick={() => setOpenModal(true)} className={styles.btnProfile}>
				<img src={profile} alt="zdjecie profilowe" />
			</button>
		</div>
		{openModal && <ChangeDataProfile onClose={() => setOpenModal(false)}/>}
		</>
	)
}
