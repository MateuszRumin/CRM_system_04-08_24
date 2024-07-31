import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AddNewProject.module.css';
import { ProjectDataForm } from '../../../components/Projects/AddNewProjectComponents/ProjectDataForm';
import { ProjectNotes } from '../../../components/Projects/AddNewProjectComponents/ProjectNotes';
import BlueButton from '../../../components/Buttons/BlueButton';
import { useProjectData } from '../../../contexts/ProjectDataContext';

export function AddNewProject() {
  const { projectData, isValid, isValidNotes, notes, setNotes, setAddedNotes } = useProjectData();
  const [employees, setEmployees] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesResponse, statusesResponse, clientsResponse] = await Promise.all([
          axios.get('http://localhost:3000/employees'),
          axios.get('http://localhost:3000/statuses/project'),
          axios.get('http://localhost:3000/client/')
        ]);

        // Przetwarzanie pracowników i dodanie UserData
        const processedEmployees = employeesResponse.data.map((employee: any) => {
          const userData = employee.UserData[0] || {};
          return {
            ...employee,
            first_name: userData.first_name || '',
            second_name: userData.second_name || ''
          };
        });

        setEmployees(processedEmployees);
        setStatuses(statusesResponse.data);
        setClients(clientsResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (data: any) => {
    console.log('Submitted data:', data);
    console.log('Submitted notes:', notes);

    try {
      const endpointUrl = 'http://localhost:3000/projects/new';

      // Konwertowanie cost na Float
      const cost = parseFloat(data.cost || '0');

      // Konwertowanie assignedUsers na liczby całkowite
      const assignedUsers = data.employees.map((userId: string) => parseInt(userId, 10));

      // Deadline w formacie ISO 8601
      const deadline = new Date(data.endDate).toISOString();

      const requestData = {
        name: data.name || '',
        client_id: parseInt(data.client || '', 10),
        status_id: parseInt(data.status || '', 10),
        description: data.description || '',
        projectDetails: {
          cost: cost,
          deadline: deadline,
        },
        assignedUsers: assignedUsers,
      };

      console.log('Request Data:', requestData);

      setNotes([]);
      setAddedNotes([]);

      const response = await axios.post(endpointUrl, requestData);
      console.log('Response:', response.data);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleButtonClick = () => {
    const form = document.getElementById('projectDataFormId') as HTMLFormElement;
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h1>Dodaj nowy projekt</h1>
        <p>Walidacja: {isValid && isValidNotes ? 'true' : 'false'}</p>
        <BlueButton
          className={`${styles.saveButton} ${!isValid || !isValidNotes ? styles.disabled : ''}`}
          disabled={!isValid || !isValidNotes}
          buttonText="Zapisz projekt"
          redirectPath="/projekty"
          onClickAction={handleButtonClick}
        />
      </div>
      <div className={styles.formContainer}>
        <div className={styles.row}>
          <ProjectDataForm
            onSubmit={handleSubmit}
            formId="projectDataFormId"
            employees={employees}
            statuses={statuses}
            clients={clients}
          />
          {/* <ProjectNotes /> */}
        </div>
      </div>
    </div>
  );
}
