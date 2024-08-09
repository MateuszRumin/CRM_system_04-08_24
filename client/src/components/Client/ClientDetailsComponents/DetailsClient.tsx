import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './DetailsClient.module.css';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface ClientDetails {
  client_id: number;
  status_id: number;
  user_id: number;
  client_type: string;
  registration_date: string;
  first_name: string;
  second_name: string;
  regon: string;
  nip: string;
  krs: string;
  company_name: string;
  address: string;
  Status: {
    name: string;
  };
  User: {
    username: string;
  };
  ClientNote: Array<{
    Note: {
      note_text: string;
    };
  }>;
  ClientTask: Array<{
    Task: {
      task_name: string;
      task_text: string;
      deadline: string;
    };
  }>;
  ClientEmail: Array<{
    email: string;
  }>;
  ClientPhone: Array<{
    tel_number: string;
  }>;
}

export function DetailsClient() {
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null);
  const location = useLocation();
  const { clientId } = location.state as { clientId: number };

  useEffect(() => {
    async function fetchClientDetails() {
      try {
        const response = await axios.get(`${apiServerUrl}/client/${clientId}/get`);
        setClientDetails(response.data);
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    }

    fetchClientDetails();
  }, [clientId]);

  if (!clientDetails) {
    return <div>Loading...</div>;
  }

  const isPrivateClient = clientDetails.client_type === 'Prywatny';

  return (
    <div className={styles.detailsContainer}>
      <h1>Szczegóły Klienta: {clientDetails.first_name} {clientDetails.second_name}</h1>

      <div className={styles.topSection}>
        <div className={styles.clientData}>
          <h2>Dane Klienta</h2>
          <div className={styles.nameFields}>
            <div className={styles.dataField}><strong>Imię:</strong> {clientDetails.first_name}</div>
            <div className={styles.dataField}><strong>Nazwisko:</strong> {clientDetails.second_name}</div>
          </div>
          <div className={styles.statusField}><strong>Status:</strong> {clientDetails.Status.name}</div>
          <div className={styles.clientDataGrid}>
            <div className={styles.dataField}><strong>Typ:</strong> {clientDetails.client_type}</div>
            
            {!isPrivateClient && (
              <>
                <div className={styles.dataField}><strong>NIP:</strong> {clientDetails.nip}</div>
                <div className={styles.dataField}><strong>REGON:</strong> {clientDetails.regon}</div>
                <div className={styles.dataField}><strong>KRS:</strong> {clientDetails.krs}</div>
                <div className={styles.dataField}><strong>Nazwa Firmy:</strong> {clientDetails.company_name}</div>
              </>
            )}

            <div className={styles.dataField}><strong>Adres Firmy:</strong> {clientDetails.address}</div>
            
            <div className={styles.emailsSection}>
              <strong>E-maile:</strong>
              {clientDetails.ClientEmail.length > 0 ? (
                clientDetails.ClientEmail.map((email, index) => (
                  <div key={index} className={styles.emailItem}>
                    {email.email}
                  </div>
                ))
              ) : (
                <div>Brak e-maili</div>
              )}
            </div>

            <div className={styles.phonesSection}>
              <strong>Telefony:</strong>
              {clientDetails.ClientPhone.length > 0 ? (
                clientDetails.ClientPhone.map((phone, index) => (
                  <div key={index} className={styles.phoneItem}>
                    {phone.tel_number}
                  </div>
                ))
              ) : (
                <div>Brak telefonów</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.notesContainer}>
          <h2>Notatki</h2>
          {clientDetails.ClientNote.length > 0 ? (
            clientDetails.ClientNote.map((note, index) => (
              <div key={index} className={styles.note}>
                <strong>Notatka {index + 1}:</strong> {note.Note.note_text}
              </div>
            ))
          ) : (
            <div>Brak notatek</div>
          )}
        </div>
      </div>

      <div className={`${styles.tasksContainer} ${styles.tasksBlock}`}>
        <h2>Zadania</h2>
        {clientDetails.ClientTask.length > 0 ? (
          clientDetails.ClientTask.map((task, index) => (
            <div key={index} className={styles.task}>
              <strong>{task.Task.task_name}</strong>
              <span>{task.Task.task_text}</span>
              <span>Termin: {new Date(task.Task.deadline).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <div>Brak zadań</div>
        )}
      </div>
    </div>
  );
}

export default DetailsClient;
