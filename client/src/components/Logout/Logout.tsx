import { ButtonTopBar } from '../ButtonTopBar/ButtonTopBar'
import logOut from '../../assets/TopBarIcons/log-out.svg'
export const Logout = () => {
	return (
		<>
			<ButtonTopBar
				path="login"
				src={logOut}
				alt="ikona wylogowania"
				onClick={() => localStorage.removeItem('token')}
			/>
		</>
	)
}
