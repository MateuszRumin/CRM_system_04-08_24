import { ButtonTopBar } from '../ButtonTopBar/ButtonTopBar'
import logOut from '../../assets/TopBarIcons/log-out.svg'
export const Logout = () => {
	return (
		<>
			<ButtonTopBar src={logOut} alt="ikona wylogowania" onClick={() => console.log('LogOut')} />
		</>
	)
}
