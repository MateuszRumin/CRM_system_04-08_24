import React, { useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './EditClient.module.css';
import { ClientDataForm } from '../../../components/Client/ModifyClientComponents/ClientDataForm';
import { ClientNotes } from '../../../components/Client/ModifyClientComponents/ClientNotes';
import { ClientTasks } from '../../../components/Client/ModifyClientComponents/ClientTasks';
import { useData } from '../../../contexts/DataContext';
import BlueButton from '../../../components/Buttons/BlueButton';

interface LocationState {
  clientId: string;
  modifiedName: string;
}

export const EditClient: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const { clientId, modifiedName } = state;
  const { isValid, isValidTasks, isValidNotes, updateClient } = useData();

  const [client] = useState({
    id: clientId,
    status: 'Zrobiony',
    assignedEmployee: 'Paweł Nowak',
    firstName: 'Ka',
    lastName: 'Nowak',
    companyType: 'company',
    nip: '55324324322222',
    regon: '222211122',
    krs: '123321123231',
    companyName: 'Weblance Kamil Wojnaraowski',
    companyAddress: 'Olszanka 19',
    emails: ['pawel201@vp.pl', 'test@vp.pl'],
    phones: ['152435345', '543213124'],
  });

  const notes = useMemo(() => [
    {
      note_id: 18,
      note_text: "przykładowa notatka numer 1",
    },
    {
      note_id: 21,
      note_text: 'Jakaś tam notatka numer 2',
    },
    {
      note_id: 22,
      note_text: "przykładowa notatka numer 1",
    },
    {
      note_id: 33,
      note_text: 'Jakaś tam notatka numer 2',
    },
  ], []);

  const tasks = useMemo(() => [
    {
      task_id: 1,
      task_title: 'testowe zadanie',
      task_deadline: '2024-06-29',
      task_status: 'Zrobiony',
      task_description: 'jakieś tam przykładowe opisy dotyczące zadania',
    },
    {
      task_id: 2,
      task_title: 'testowe zadanie 2',
      task_deadline: '2024-06-29',
      task_status: 'Zrobiony',
      task_description: 'jakieś tam przykładowe opisy dotyczące zadania 2',
    },
    {
      task_id: 20,
      task_title: 'testowe zadanie 200',
      task_deadline: '2024-06-29',
      task_status: 'Zrobiony',
      task_description: 'jakieś tam przykładowe opisy dotyczące zadania',
    },
    {
      task_id: 23,
      task_title: 'testowe zadanie 230',
      task_deadline: '2024-06-29',
      task_status: 'Zrobiony',
      task_description: 'jakieś tam przykładowe opisy dotyczące zadania 2',
    },
  ], []);

  const handleSubmit = (data: any) => {
    updateClient(clientId, data);

    // sendDataToServerUpdatedClient();

  };

  const memoizedClientDataForm = useCallback(
    () => <ClientDataForm clientData={client} onSubmit={handleSubmit} formId="clientDataForm" />,
    [client]
  );

  const memoizedClientNotes = useCallback(
    () => <ClientNotes initialNotes={notes} />,
    [notes]
  );

  const memoizedClientTasks = useCallback(
    () => <ClientTasks tasks={tasks} />,
    [tasks]
  );

  const handleClick = () => {
    const formElement = document.getElementById('clientDataForm') as HTMLFormElement;
    if (formElement) {
      formElement.requestSubmit();
    }

  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h1>Edycja klienta: {modifiedName}</h1>
        <p>Walidacja: {isValid && isValidTasks && isValidNotes ? 'true' : 'false'}</p>
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
          {memoizedClientNotes()}
        </div>
        {memoizedClientTasks()}
      </div>
    </div>
  );
};
