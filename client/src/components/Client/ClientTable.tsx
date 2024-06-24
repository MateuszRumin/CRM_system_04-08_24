import React, { useState } from 'react';
import styles from './ClientTable.module.css';
import { ClientRow } from './ClientRow';
import Pagination from './Pagination';

interface Client {
  name: string;
  status: string;
  projects: string;
  nextPayment: string;
  addedOn: string;
}

// Mock data simulating API response
const clients = [
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Niepodjęty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'W trakcie',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Zdobyty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Stracony',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Niepodjęty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'W trakcie',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Zdobyty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Stracony',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Niepodjęty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'W trakcie',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Zdobyty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Stracony',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Niepodjęty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'W trakcie',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Zdobyty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Stracony',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Niepodjęty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'W trakcie',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Zdobyty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Stracony',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Niepodjęty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'W trakcie',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Zdobyty',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - Organiczny',
  },
  {
    name: 'Weblance Kamil Wojnaraowski',
    status: 'Stracony',
    projects: '5 aktywnych / 10 wszystkich',
    nextPayment: 'FV #1650 - 28.06.2024 - 2600 zł netto',
    addedOn: '01.06.2024 - test',
  },
];

export const ClientTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Default items per page
  const itemsPerPageOptions: number[] = [10, 20, 30, 50]; // Options for items per page

  // Get current clients based on pagination
  const indexOfLastClient: number = currentPage * itemsPerPage;
  const indexOfFirstClient: number = indexOfLastClient - itemsPerPage;
  const currentClients: Client[] = clients.slice(indexOfFirstClient, indexOfLastClient);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Change items per page
  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Imię i nazwisko / Firma</th>
            <th>Status</th>
            <th>Projekty</th>
            <th>Nadchodząca płatność</th>
            <th>Dodano</th>
            <th>Więcej</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.map((client, index) => (
            <ClientRow key={index} client={client} />
          ))}
        </tbody>
      </table>
      <div>
      <Pagination
        itemsPerPageOptions={itemsPerPageOptions}
        itemsPerPage={itemsPerPage}
        totalItems={clients.length}
        currentPage={currentPage}
        paginate={paginate}
        changeItemsPerPage={changeItemsPerPage}
      />
      </div>
      
    </div>
  );
};
