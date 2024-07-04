import styles from './AddNewClient.module.css';
import { ClientDataForm } from '../../../components/Client/AddNewClientComponents/ClientDataForm';
import { ClientNotes } from '../../../components/Client/AddNewClientComponents/ClientNotes';
import { ClientTasks } from '../../../components/Client/AddNewClientComponents/ClientTasks';
import BlueButton from '../../../components/Buttons/BlueButton';
import { useData } from '../../../contexts/DataContext';

export function AddNewClient() {
  const { isValid, isValidNotes, isValidTasks } = useData();
  const { notes, tasks, setNotes, setAddedNotes, setTasks, setAddedTasks } = useData();

  const handleSubmit = (data: any) => {
    console.log('Submitted data:', data); 
    console.log('Submitted notes:', notes); 
    console.log('Submitted tasks:', tasks); 

  //// tutaj będzie wykorzystanie endpointu do dodania do bazy danych 

    setNotes([]);
    setAddedNotes([]);
    setTasks([]);
    setAddedTasks([]);

    
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