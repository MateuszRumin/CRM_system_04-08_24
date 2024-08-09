import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './EditClient.module.css';
import { ClientDataForm } from '../../../components/Client/ModifyClientComponents/ClientDataForm';
import { ClientNotes } from '../../../components/Client/ModifyClientComponents/ClientNotes';
import { ClientTasks } from '../../../components/Client/ModifyClientComponents/ClientTasks';
import { useData } from '../../../contexts/DataContext';
import BlueButton from '../../../components/Buttons/BlueButton';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface LocationState {
  clientId: string;
  modifiedName: string;
}

interface ClientEmail {
  email_id: number;
  client_id: number;
  email: string;
}

interface ClientPhone {
  phone_id: number;
  client_id: number;
  tel_number: string;
}

export const EditClient: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const { modifiedName } = state;
  const navigate = useNavigate();
  const { clientId, setClientId, isValid, isValidTasks, isValidNotes, deletedNotes, updateClient, sendDataToServerUpdatedClient } = useData();

  const [client, setClient] = useState<any>({
    id: '',
    status: '',
    assignedEmployee: '',
    firstName: '',
    lastName: '',
    companyType: '',
    nip: '',
    regon: '',
    krs: '',
    companyName: '',
    companyAddress: '',
    emails: [],
    phones: [],
  });

  const [notes, setNotes] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    setClientId(state.clientId);

    axios.get(`${apiServerUrl}/client/${state.clientId}/get`)
      .then(response => {
        const data = response.data;
        setClient({
          id: data.client_id,
          status: data.status_id,
          assignedEmployee: data.User.username,
          firstName: data.first_name,
          lastName: data.second_name,
          companyType: data.client_type,
          nip: data.nip,
          regon: data.regon,
          krs: data.krs,
          companyName: data.company_name,
          companyAddress: data.address,
          emails: data.ClientEmail.map((email: ClientEmail) => email.email), // mapowanie emaili z typem
          phones: data.ClientPhone.map((phone: ClientPhone) => phone.tel_number),  // mapowanie telefonów z typem
        });

        const fetchedNotes = data.ClientNote.map((clientNote: any) => ({
          note_id: clientNote.Note.note_id,
          note_text: clientNote.Note.note_text,
        }));
        setNotes(fetchedNotes);

        const fetchedTasks = data.ClientTask.map((clientTask: any) => ({
          task_id: clientTask.Task.task_id,
          task_title: clientTask.Task.task_name,
          task_deadline: format(new Date(clientTask.Task.deadline), 'yyyy-MM-dd'),
          task_status: clientTask.Task.status_id,
          task_description: clientTask.Task.task_text,
        }));
        setTasks(fetchedTasks);
      })
      .catch(error => {
        console.error('Error fetching client data:', error);
      });
  }, [state.clientId, setClientId]);

  const handleSubmit = async (data: any) => {
    console.log('Dane wejściowe w handleSubmit:', data);
  
    updateClient(clientId, data);
  
  };

  const memoizedClientDataForm = useCallback(
    () => <ClientDataForm clientData={client} onSubmit={handleSubmit} formId="clientDataForm" />,
    [client]
  );

  const memoizedClientNotes = useMemo(
    () => <ClientNotes initialNotes={notes} />,
    [notes]
  );

  const memoizedClientTasks = useMemo(
    () => <ClientTasks tasks={tasks} />,
    [tasks]
  );

  const handleClick = () => {
    const formElement = document.getElementById('clientDataForm') as HTMLFormElement;
    if (formElement) {
      formElement.requestSubmit();
    }
    navigate('/klienci');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h1>Edycja klienta: {modifiedName}</h1>
        {/* <p> Walidacja: {isValid && isValidTasks && isValidNotes ? 'true' : 'false'}</p> */}
        <BlueButton
          buttonText='Zapisz zmiany'
          buttonStyle={styles.blueButton}
          disabled={!isValid || !isValidTasks || !isValidNotes}
          onClickAction={handleClick}
        />
      </div>
      <div className={styles.formContainer}>
        <div className={styles.row}>
          {memoizedClientDataForm()}
          {memoizedClientNotes}
        </div>
        {memoizedClientTasks}
      </div>
    </div>
  );
};
