import './styles/theme.css';
import './styles/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext.tsx';
import { ProjectDataProvider } from './contexts/ProjectDataContext.tsx';
import { UserProvider } from './contexts/UserContext.tsx';
// import { Kreator } from './views/Kreator/Kreator.tsx';
import { Faktury } from './views/Faktury/Faktury.tsx';
import { NewInvoiceForm } from './components/Invoice/NewInvoiceForm.tsx';
import { Umowy } from './views/Umowy/Umowy.tsx';
import { Projekty } from './views/Projekty/Projekty.tsx';
import { Pracownicy } from './views/Pracownicy/Pracownicy.tsx';
import { Uprawnienia } from './views/Uprawnienia/Uprawnienia.tsx';
import { Klienci } from './views/Klienci/Klienci.tsx';
import { StronaGlowna } from './views/StronaGlowna/StronaGlowna.tsx';
import { Layout } from './components/Layout/Layout.tsx';
import { AddNewClient } from './views/Klienci/Dodaj_nowego_klienta/AddNewClient.tsx';
import { EditClient } from './views/Klienci/Edytuj_klienta/EditClient.tsx';
import { Logowanie } from './views/Logowanie/Logowanie.tsx';
// import { Ustawienia } from './views/Ustawienia/Ustawienia.tsx';
import { NewContractForm } from './components/Contracts/NewContractForm.tsx';
import { AddNewEmployee } from './views/Pracownicy/Dodaj_nowego_pracownika/AddNewEmployee.tsx';
import { EditEmployee } from './views/Pracownicy/Edytuj_pracownika/EditEmployee.tsx';
import { EmployeeDetails } from './views/Pracownicy/EmployeeDetails.tsx';
import { AssignProjectToEmployee } from './views/Pracownicy/Przypisz_projekt_do_pracownika/AssignProjectToEmployee.tsx';
import { RemoveEmployee } from './views/Pracownicy/Usun_pracownika/RemoveEmployee.tsx';
import { ProjectDetails } from './views/Projekty/ProjectDetails.tsx';
import { AddNewProject } from './views/Projekty/Dodaj_nowy_projekt/AddNewProject.tsx';
import { EditProject } from './views/Projekty/Edytuj_projekt/EditProject.tsx';
import { InvoiceDetails } from './views/Faktury/InvoiceDetails.tsx';
import { AuthRoute } from './components/auth/auth.tsx';
import { DetailsClient } from './components/Client/ClientDetailsComponents/DetailsClient.tsx'
import { InvoiceSettings } from './components/Invoice/InvoiceSettings.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <AuthRoute allowedRoles={['Admin', 'User', 'Moderator']}><StronaGlowna /></AuthRoute>,
      },
      // {
      //   path: 'kreator',
      //   element: <AuthRoute allowedRoles={['Admin']}><Kreator /></AuthRoute>,
      // },
      {
        path: 'faktury',
        element: <AuthRoute allowedRoles={['Admin']}><Faktury /></AuthRoute>,
        children: [
          {
            path: 'details-invoice/:invoice_id',
            element: <AuthRoute allowedRoles={['Admin']}><InvoiceDetails /></AuthRoute>,
          },
          // {
          //   path: 'new',
          //   element: <AuthRoute allowedRoles={['Admin']}><NewInvoiceForm /></AuthRoute>,
          // },
        ],
      },
      {
        path: 'faktury/new',
        element: <AuthRoute allowedRoles={['Admin']}><NewInvoiceForm /></AuthRoute>,
      },
      {
        path: 'umowy/new',
        element: <AuthRoute allowedRoles={['Admin']}><NewContractForm /></AuthRoute>,
      },
      {
        path: 'umowy',
        element: <AuthRoute allowedRoles={['Admin']}><Umowy /></AuthRoute>,
      },
      {
        path: 'projekty',
        element: <AuthRoute allowedRoles={['Admin']}><Projekty /></AuthRoute>,
        children: [
          {
            path: 'details-project/:name',
            element: <AuthRoute allowedRoles={['Admin']}><ProjectDetails /></AuthRoute>,
          },
          {
            path: 'add-project',
            element: <AuthRoute allowedRoles={['Admin']}><AddNewProject /></AuthRoute>,
          },
          {
            path: 'edit-project/:id',
            element: <AuthRoute allowedRoles={['Admin']}><EditProject /></AuthRoute>,
          },
        ],
      },
      {
        path: 'pracownicy',
        element: <AuthRoute allowedRoles={['Admin']}><Pracownicy /></AuthRoute>,
        children: [
          {
            path: 'register',
            element: <Logowanie />,
          },
          {
            path: 'add-employee',
            element: <AuthRoute allowedRoles={['Admin']}><AddNewEmployee /></AuthRoute>,
          },
          {
            path: 'edit-employee/:id',
            element: <AuthRoute allowedRoles={['Admin']}><EditEmployee /></AuthRoute>,
          },
          {
            path: 'details-employee/:id',
            element: <AuthRoute allowedRoles={['Admin']}><EmployeeDetails /></AuthRoute>,
            children: [
              {
                path: 'assign-project-to-employee',
                element: <AuthRoute allowedRoles={['Admin']}><AssignProjectToEmployee /></AuthRoute>,
              },
              {
                path: 'remove-employee',
                element: <AuthRoute allowedRoles={['Admin']}><RemoveEmployee /></AuthRoute>,
              },
            ],
          },
        ],
      },
      {
        path: 'uprawnienia',
        element: <AuthRoute allowedRoles={['Admin']}><Uprawnienia /></AuthRoute>,
      },
      {
        path: 'klienci',
        element: <AuthRoute allowedRoles={['Admin']}><Klienci /></AuthRoute>,
        children: [
          {
            path: 'add-client',
            element: <AuthRoute allowedRoles={['Admin']}><AddNewClient /></AuthRoute>,
          },
          {
            path: 'edit-client/:id',
            element: <AuthRoute allowedRoles={['Admin']}><EditClient /></AuthRoute>,
          },
          {
            path: 'details-client/:id',
            element: <AuthRoute allowedRoles={['Admin']}><DetailsClient /></AuthRoute>,
          },
        ],
      },
      {
        path: 'ustawienia',
        element: <AuthRoute allowedRoles={['Admin']}><InvoiceSettings /></AuthRoute>,
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
    <UserProvider>
      <DataProvider>
        <ProjectDataProvider>
          <RouterProvider router={router} />
        </ProjectDataProvider>
      </DataProvider>
    </UserProvider>
  </React.StrictMode>
);

