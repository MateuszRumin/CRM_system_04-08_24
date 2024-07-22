import './styles/theme.css'
import './styles/globals.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DataProvider } from './contexts/DataContext.tsx'
import { ProjectDataProvider  } from './contexts/ProjectDataContext.tsx'
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
import { AssignProjectToEmployee } from './views/Pracownicy/Przypisz_projekt_do_pracownika/AssignProjectToEmployee.tsx'
import { RemoveEmployee } from './views/Pracownicy/Usun_pracownika/RemoveEmployee.tsx'
import { ProjectDetails } from './views/Projekty/ProjectDetails.tsx'
import { AddNewProject } from './views/Projekty/Dodaj_nowy_projekt/AddNewProject.tsx'

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
        path: 'kreator',
        element: <Kreator />,
      },
      {
        path: 'faktury',
        element: <Faktury />,
      },
      {
        path: 'umowy',
        element: <Umowy />,
      },
      {
        path: 'projekty',
        element: <Projekty />,
        children: [
          {
            path: 'details-project/:name',
            element: <ProjectDetails />,
          },
          {
            path: 'add-project',
            element: <AddNewProject />,
          },
        ],
      },
			{
				path: 'projekty/details-project/:name',
				element: <ProjectDetails />,
			},
      {
        path: '/pracownicy',
        element: <Pracownicy />,
        children: [
          {
            path: 'register',
            element: <Logowanie />,
          },
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
            children: [
              {
                path: 'assign-project-to-employee',
                element: <AssignProjectToEmployee />,
              },
              {
                path: 'remove-employee',
                element: <RemoveEmployee />,
              },
            ],
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
            path: 'edit-client/:id',
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
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataProvider>
      <ProjectDataProvider>
        <RouterProvider router={router}></RouterProvider>
      </ProjectDataProvider>
    </DataProvider>
  </React.StrictMode>
);
