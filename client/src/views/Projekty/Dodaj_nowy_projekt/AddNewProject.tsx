import styles from './AddNewProject.module.css';
import { ProjectDataForm } from '../../../components/Projects/AddNewProjectComponents/ProjectDataForm';
import { ProjectNotes } from '../../../components/Projects/AddNewProjectComponents/ProjectNotes';
import BlueButton from '../../../components/Buttons/BlueButton';
import axios from 'axios';
import { useProjectData } from '../../../contexts/ProjectDataContext';

export function AddNewProject() {
  const { projectData, isValid, isValidNotes, notes, setNotes, setAddedNotes } = useProjectData();

  const handleSubmit = async (data: any) => {
    console.log('Submitted data:', data);
    console.log('Submitted notes:', notes);

    try {
      const endpointUrl = 'http://localhost:3000/project/new'; // to jest testowe i jeszcze nie ma takiego endpointu

      const requestData = {
        project: {
          name: data.name || '',
          end_date: data.endDate || '',
          client: data.client || '',
          employees: data.employees || []
        },
        notes: notes.map((note: any) => ({
          note_text: note.note_text,
        })),
      };

      console.log('Request Data:', requestData);

      // Clear form data after successful submission
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
          <ProjectDataForm onSubmit={handleSubmit} formId="projectDataFormId" />
          <ProjectNotes />
        </div>
      </div>
    </div>
  );
}
