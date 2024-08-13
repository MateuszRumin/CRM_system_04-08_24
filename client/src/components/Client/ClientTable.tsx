import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ClientTable.module.css';
import { ClientRow } from './ClientRow';
import Pagination from './Pagination';
import { parseISO, format } from 'date-fns';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface Client {
  id: number;
  name: string;
  status: string;
  projects: string;
  nextPayment: string;
  addedOn: string;
}

interface ClientTableProps {
  searchTerm: string;
  filterOptions: { [key: string]: string };
  refresh: boolean;
}

export const ClientTable: React.FC<ClientTableProps> = ({ searchTerm, filterOptions, refresh }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const itemsPerPageOptions: number[] = [10, 20, 30, 50];
  const [noProjectsMessage, setNoProjectsMessage] = useState<string | null>(null);

  const fetchProjectNames = async (projects: any[]) => {
    const projectNames = await Promise.all(
      projects.map(async (project: any) => {
        const response = await axios.get(`${apiServerUrl}/projects/${project.project_id}`);
        return response.data.name;
      })
    );
    return projectNames.join(', ');
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiServerUrl}/client/`);
      const clientData = await Promise.all(
        response.data.data.map(async (client: any) => {
          const projects = await fetchProjectNames(client.Project);
          return {
            id: client.client_id,
            name: client.first_name ? `${client.first_name} ${client.second_name}` : client.company_name,
            status: client.Status.name,
            projects: projects || 'Brak projektów', // Provide default message here
            nextPayment: 'jeszcze brak z backendu',
            addedOn: format(parseISO(client.registration_date), 'dd.MM.yyyy'),
          };
        })
      );
      
      setClients(clientData);
      setFilteredClients(clientData);
      // Check if there are no clients and update the noProjectsMessage state
      setNoProjectsMessage(clientData.length === 0 ? 'Brak projektów' : null);
    } catch (error) {
      console.error("There was an error fetching the clients!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const parseDate = (dateString: string) => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  useEffect(() => {
    let results = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (Object.keys(filterOptions).length > 0) {
      results = results.filter(client => {
        return Object.entries(filterOptions).every(([key, value]) => {
          if (key === 'projects') {
            const [activeFilter, totalFilter] = value.split('/').map(item => item.trim());
            const [activeProjectsClient, totalProjectsClient] = client.projects
              .split('/')
              .map(item => parseInt(item.trim(), 10));

            const activeMatches = activeFilter === '' || activeProjectsClient.toString() === activeFilter;
            const totalMatches = totalFilter === '' || totalProjectsClient.toString() === totalFilter;

            return activeMatches && totalMatches;
          } else if (key === 'nextPayment') {
            const [invoiceNumberFilter, paymentDateFilter, paymentAmountFilter] = value.split(' - ').map(item => item.trim());
            const [invoiceNumberClient, paymentDateClient, paymentAmountClient] = client.nextPayment.split(' - ').map(item => item.trim());

            const invoiceMatches = invoiceNumberFilter === '' || invoiceNumberClient.includes(invoiceNumberFilter);

            const formattedPaymentDateFilter = paymentDateFilter ? parseISO(paymentDateFilter) : null;
            const formattedPaymentDateClient = parseDate(paymentDateClient);

            const dateMatches = !formattedPaymentDateFilter || (formattedPaymentDateClient && formattedPaymentDateClient.getTime() === formattedPaymentDateFilter.getTime());

            const amountMatches = paymentAmountFilter === '' || paymentAmountClient.includes(paymentAmountFilter);

            return invoiceMatches && dateMatches && amountMatches;
          } else if (key === 'addedOn') {
            const [addedDateFilter, addedSourceFilter] = value.split(' - ').map(item => item.trim());
            const [addedDateClient, addedSourceClient] = client.addedOn.split(' - ').map(item => item.trim());

            const formattedAddedDateFilter = addedDateFilter ? parseDate(addedDateFilter) : null;
            const formattedAddedDateClient = parseDate(addedDateClient);

            const dateMatches = !formattedAddedDateFilter || (formattedAddedDateClient && formattedAddedDateClient.getTime() === formattedAddedDateFilter.getTime());
            const sourceMatches = addedSourceFilter === '' || addedSourceClient.includes(addedSourceFilter);

            return dateMatches && sourceMatches;
          } else {
            if (typeof value === 'string') {
              return client[key as keyof Client].toString().toLowerCase().includes(value.toLowerCase());
            } else {
              return client[key as keyof Client] === value;
            }
          }
        });
      });
    }

    setFilteredClients(results);
    setCurrentPage(1);
    // Update the noProjectsMessage state based on the filtered results
    setNoProjectsMessage(results.length === 0 ? 'Brak projektów' : null);
  }, [searchTerm, filterOptions, clients]);

  const indexOfLastClient: number = currentPage * itemsPerPage;
  const indexOfFirstClient: number = indexOfLastClient - itemsPerPage;
  const currentClients: Client[] = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleDeleteClient = (clientId: number) => {
    setClients(prevClients => prevClients.filter(client => client.id !== clientId));
    setFilteredClients(prevClients => prevClients.filter(client => client.id !== clientId));
  };

  return (
    <div className={styles.tableContainer}>
      {noProjectsMessage ? (
        <p>{noProjectsMessage}</p>
      ) : (
        <>
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
              {currentClients.map((client) => (
                <ClientRow key={client.id} client={client} onDelete={handleDeleteClient} />
              ))}
            </tbody>
          </table>
          <div>
            <Pagination
              itemsPerPageOptions={itemsPerPageOptions}
              itemsPerPage={itemsPerPage}
              totalItems={filteredClients.length}
              currentPage={currentPage}
              paginate={paginate}
              changeItemsPerPage={changeItemsPerPage}
            />
          </div>
        </>
      )}
    </div>
  );
};
