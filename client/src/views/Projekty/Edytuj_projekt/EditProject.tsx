import styles from './EditProject.module.css';
import ProjectDataForm from '../../../components/Projects/ModifyProjectComponents/ProjectDataForm';
import ProjectNotes from '../../../components/Projects/ModifyProjectComponents/ProjectNotes';
import BlueButton from '../../../components/Buttons/BlueButton';
import axios from 'axios';
import { useProjectData } from '../../../contexts/ProjectDataContext';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export function EditProject() {
  const { projectId } = useParams<{ projectId: string }>();
  const { state } = useLocation<{ project: any }>();
  const { projectData, setProjectData, isValid, isValidNotes, notes, setNotes } = useProjectData();

  const [initialNotes, setInitialNotes] = useState<any[]>([]);
  const [addedNotes, setAddedNotesState] = useState<any[]>([]);
  const [removedNotes, setRemovedNotesState] = useState<any[]>([]);
  const [modifiedNotes, setModifiedNotesState] = useState<any[]>([]);

  useEffect(() => {
    if (state && state.project) {
      setProjectData(state.project);
      setNotes(state.project.notes || []);
      setInitialNotes(state.project.notes || []);
    } else {
      const fetchProjectData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/project/${projectId}`);
          const { project, notes } = response.data;
          setProjectData(project);
          setNotes(notes);
          setInitialNotes(notes);
        } catch (error) {
          console.error('Error fetching project data:', error);
        }
      };

      fetchProjectData();
    }
  }, [projectId, setProjectData, setNotes, state]);

  useEffect(() => {
    const added = notes.filter(note => note.isNew);
    const removed = initialNotes.filter(note => !notes.find(n => n.note_id === note.note_id));
    const modified = notes.filter(note => {
      const initialNote = initialNotes.find(n => n.note_id === note.note_id);
      return initialNote && initialNote.note_text !== note.note_text && !note.isNew;
    });

    setAddedNotesState(added);
    setRemovedNotesState(removed);
    setModifiedNotesState(modified);
  }, [notes, initialNotes]);

  const handleSubmit = async (data: any) => {
    try {
      const requestData = {
        project: {
          name: data.projectName || '',
          end_date: data.endDate || '',
          client: data.client || '',
          employees: data.employees || []
        },
        addedNotes: addedNotes.map(note => ({
          id: note.note_id,
          note_text: note.note_text,
        })),
        removedNotes: removedNotes.map(note => ({
          id: note.note_id,
          note_text: note.note_text,
        })),
        modifiedNotes: modifiedNotes.map(note => ({
          id: note.note_id,
          note_text: note.note_text,
        }))
      };

      console.log('Project Data:', requestData.project);
      console.log('Added Notes:', requestData.addedNotes);
      console.log('Removed Notes:', requestData.removedNotes);
      console.log('Modified Notes:', requestData.modifiedNotes);

      // Jeśli chcesz wysłać te dane do serwera, usuń komentarz poniżej
      // const endpointUrl = `http://localhost:3000/project/${projectId}/edit`;
      // const response = await axios.put(endpointUrl, requestData);
      // console.log('Response:', response.data);
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
        <h1>Edytuj projekt</h1>
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

export default EditProject;
