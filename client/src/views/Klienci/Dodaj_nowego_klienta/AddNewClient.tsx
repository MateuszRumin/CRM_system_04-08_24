import styles from './AddNewClient.module.css';
import { ClientDataForm } from '../../../components/Client/AddNewClientComponents/ClientDataForm';
import { ClientNotes } from '../../../components/Client/AddNewClientComponents/ClientNotes';
import { ClientTasks } from '../../../components/Client/AddNewClientComponents/ClientTasks';
import BlueButton from '../../../components/Buttons/BlueButton';
import axios from 'axios';
import { useData } from '../../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

export function AddNewClient() {
  const { isValid, isValidNotes, isValidTasks } = useData();
  const { notes, tasks, setNotes, setAddedNotes, setTasks, setAddedTasks } = useData();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    console.log('Submitted data:', data);
    console.log('Submitted notes:', notes);
    console.log('Submitted tasks:', tasks);

    try {
      const endpointUrl = 'http://localhost:3000/client/new';

      const requestData = {
        client: {
          user_id: 1 || '',
          status_id: parseInt(data.status) || '',
          client_type: data.companyType || '',
          first_name: data.firstName || '',
          second_name: data.lastName || '',
          address: data.companyAddress || data.privateAddress || '',
          regon: data.regon || '',
          nip: data.nip || '',
          krs: data.krs || '',
          company_name: data.companyName || ''
        },
        notes: notes.map((note: any) => ({
          note_text: note.note_text,
        })),
        tasks: tasks.map((task: any) => ({
          task_text: task.description,
          task_name: task.title,
          deadline: new Date(task.deadline).toISOString(), // Konwersja na format ISO-8601
        })),
        emails: data.emails,  
        phones: data.phones  
      };

      console.log('Request Data:', requestData);
      console.log("to są maile i telefony",data.phones, data.emails)

      const response = await axios.post(endpointUrl, requestData);
      console.log('Response:', response.data);

      // Clear form data after successful submission
      setNotes([]);
      setAddedNotes([]);
      setTasks([]);
      setAddedTasks([]);

      navigate('/klienci');

    } catch (error) {
      console.error('Error:', error);
      // Handle error or show an error message to the user
    }
  };

  const handleButtonClick = () => {
    const form = document.getElementById('clientDataFormId') as HTMLFormElement;
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h1>Dodaj klienta</h1>
        <p>Walidacja: {isValid && isValidNotes && isValidTasks ? 'true' : 'false'}</p>
        <BlueButton
          className={`${styles.sdsds} ${!isValid || !isValidNotes || !isValidTasks ? styles.disabled : ''}`}
          disabled={!isValid || !isValidNotes || !isValidTasks}
          buttonText="Zapisz zmiany"
          onClickAction={handleButtonClick}
        />
      </div>
      <div className={styles.formContainer}>
        <div className={styles.row}>
          <ClientDataForm onSubmit={handleSubmit} formId="clientDataFormId" />
          <ClientNotes />
        </div>
        <ClientTasks />
      </div>
    </div>
  );
}
