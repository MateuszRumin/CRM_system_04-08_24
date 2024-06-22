import './styles/theme.css'
import './styles/globals.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Kreator } from './views/Kreator/Kreator.tsx'
import { Faktury } from './views/Faktury/Faktury.tsx'
import { Umowy } from './views/Umowy/Umowy.tsx'
import { Projekty } from './views/Projekty/Projekty.tsx'
import { Pracownicy } from './views/Pracownicy/Pracownicy.tsx'
import { Uprawnienia } from './views/Uprawnienia/Uprawnienia.tsx'
import { Klienci } from './views/Klienci/Klienci.tsx'
import { StronaGlowna } from './views/StronaGlowna/StronaGlowna.tsx'
import { Layout } from './components/Layout/Layout.tsx'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <StronaGlowna />,
			},
			{
				path: '/kreator',
				element: <Kreator />,
			},
			{
				path: '/faktury',
				element: <Faktury />,
			},
			{
				path: '/umowy',
				element: <Umowy />,
			},
			{
				path: '/projekty',
				element: <Projekty />,
				children: [
					{
						path: '/projekty/test/',
						element: <Projekty />,
					},
				],
			},
			{
				path: '/pracownicy',
				element: <Pracownicy />,
			},
			{
				path: '/uprawnienia',
				element: <Uprawnienia />,
			},
			{
				path: '/klienci',
				element: <Klienci />,
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router}></RouterProvider>
	</React.StrictMode>
)
