import styles from './EditProject.module.css';
import ProjectDataForm from '../../../components/Projects/ModifyProjectComponents/ProjectDataForm';
import BlueButton from '../../../components/Buttons/BlueButton';
import axios from 'axios';
import { useProjectData } from '../../../contexts/ProjectDataContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

export function EditProject() {
  const { id } = useParams<{ id: string }>();
  const { setProjectData, isValid, setValid } = useProjectData();

  const [project, setProject] = useState<any>(null);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) {
        console.error('Brak projectId');
        return;
      }

      try {
        const projectResponse = await axios.get(`${apiServerUrl}/projects/${id}`);
        setProject(projectResponse.data);
        setProjectData(projectResponse.data);

        const statusesResponse = await axios.get(`${apiServerUrl}/statuses/project`);
        setStatuses(statusesResponse.data);

        const employeesResponse = await axios.get(`${apiServerUrl}/employees`);
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProjectData();
  }, [id, setProjectData]);

  const handleSubmit = async (data: any) => {
    if (!id) {
      console.error('Brak projectId');
      return;
    }
  
    try {
      // Konwertuj datę do formatu ISO 8601
      const isoDeadline = new Date(data.deadline).toISOString();
  
      // Konwertuj status_id na liczbę całkowitą
      const statusIdInt = parseInt(data.status_id, 10);
      if (isNaN(statusIdInt)) {
        throw new Error('Podano niepoprawny status_id');
      }
  
      const updatedProject = {
        name: data.name || '',
        status_id: statusIdInt, // Używamy liczby całkowitej
        description: data.description || '',
        projectDetails: {
          cost: parseFloat(data.cost) || 0, // Konwertuj koszt na liczbę
          deadline: isoDeadline,
        },
        assignedUsers: data.assignedUsers || [],
      };
  
      await axios.put(`${apiServerUrl}/projects/${id}`, updatedProject);
      console.log('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
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
        <h1>Edytuj projekt</h1>
        <p>Walidacja: {isValid ? 'true' : 'false'}</p>
        <BlueButton
          className={`${styles.saveButton} ${!isValid ? styles.disabled : ''}`}
          disabled={!isValid}
          buttonText="Zapisz projekt"
          redirectPath="/projekty"
          onClickAction={handleButtonClick}
        />
      </div>
      <div className={styles.formContainer}>
        {project && (
          <ProjectDataForm 
            onSubmit={handleSubmit} 
            formId="projectDataFormId"
            statuses={statuses} 
            employees={employees} 
            initialValues={project} // Przekazujemy dane projektu jako initialValues
          />
        )}
      </div>
    </div>
  );
}

export default EditProject;
