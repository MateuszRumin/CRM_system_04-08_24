import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'
import { Topbar } from '../Topbar/Topbar'
import { MainContent } from '../MainContent/MainContent'

export const Layout = () => {
	return (
		<>
			<Sidebar />
			<MainContent>
				<Topbar />
				<Outlet />
			</MainContent>
		</>
	)
}
