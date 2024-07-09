import './styles/theme.css'
import './styles/globals.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DataProvider } from './contexts/DataContext.tsx'
import { Kreator } from './views/Kreator/Kreator.tsx'
import { Faktury } from './views/Faktury/Faktury.tsx'
import { Umowy } from './views/Umowy/Umowy.tsx'
import { Projekty } from './views/Projekty/Projekty.tsx'
import { Pracownicy } from './views/Pracownicy/Pracownicy.tsx'
import { Uprawnienia } from './views/Uprawnienia/Uprawnienia.tsx'
import { Klienci } from './views/Klienci/Klienci.tsx'
import { StronaGlowna } from './views/StronaGlowna/StronaGlowna.tsx'
import { Layout } from './components/Layout/Layout.tsx'
import { AddNewClient } from './views/Klienci/Dodaj_nowego_klienta/AddNewClient.tsx'
import { EditClient } from './views/Klienci/Edytuj_klienta/EditClient.tsx'
import { Logowanie } from './views/Logowanie/Logowanie.tsx'
import { AddNewEmployee } from './views/Pracownicy/Dodaj_nowego_pracownika/AddNewEmployee.tsx'
import { EditEmployee } from './views/Pracownicy/Edytuj_pracownika/EditEmployee.tsx'
import { EmployeeDetails } from './views/Pracownicy/EmployeeDetails.tsx'

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
            path: 'test/',
            element: <Projekty />,
          },
        ],
      },
      {
        path: '/pracownicy',
        element: <Pracownicy />,
        children: [
          {
            path: 'add-employee',
            element: <AddNewEmployee />,
          },
          {
            path: 'edit-employee/:id',
            element: <EditEmployee />,
          },
          {
            path: 'details-employee/:id',
            element: <EmployeeDetails />,
          },
        ],
      },
      {
        path: '/uprawnienia',
        element: <Uprawnienia />,
      },
      {
        path: '/klienci',
        element: <Klienci />,
        children: [
          {
            path: 'add-client',
            element: <AddNewClient />,
          },
          {
            path: 'edit-client/:id', // Include a parameter for client ID
            element: <EditClient />,
          },
        ],
      },
    ],
  },
	{
		path: '/login',
		element: <Logowanie />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataProvider>
      <RouterProvider router={router}></RouterProvider>
    </DataProvider>
  </React.StrictMode>
);
