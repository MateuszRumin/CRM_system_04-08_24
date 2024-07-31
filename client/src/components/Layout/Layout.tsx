import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'
import { Topbar } from '../Topbar/Topbar'
import { MainContent } from '../MainContent/MainContent'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

export const Layout = () => {
	// const [token, setToken] = useState(localStorage.getItem('token') || '')

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			localStorage.setItem('token', token)
			const decodedToken = jwtDecode(token)
			const role = decodedToken.role
			const userId = decodedToken.userId

			localStorage.setItem('USER', JSON.stringify({ role, userId }))
		}
	}, [])

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
