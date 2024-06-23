import { ButtonTopBar } from '../ButtonTopBar/ButtonTopBar'
import bell from '../../assets/TopBarIcons/bell.svg'
export const Notifications = () => {
	return (
		<>
			<ButtonTopBar src={bell} alt="ikona powiadomien" onClick={() => console.log('Powiadomienia')} />
		</>
	)
}
