import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MettingForm.module.css';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface MeetingFormProps {
  meeting?: any; // Zastąp `any` bardziej szczegółowym typem, jeśli masz
  projectId?: number; // Dodaj projekt_id
  onSave: (meeting: any) => void;
  onCancel: () => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ meeting, projectId, onSave, onCancel }) => {
  const [formState, setFormState] = useState({
    date: '',
    timeSpent: '',
    description: '',
    outcomes: '',
    link: ''
  });

  useEffect(() => {
    if (meeting) {
      const date = new Date(meeting.date);
      if (!isNaN(date.getTime())) {
        const formattedDate = date.toISOString().slice(0, 19);
        setFormState({
          date: formattedDate,
          timeSpent: meeting.time_spent || '',
          description: meeting.meeting_description || '',
          outcomes: meeting.meeting_outcomes || '',
          link: meeting.meeting_link || ''
        });
      } else {
        console.error('Invalid date value:', meeting.date);
        setFormState({
          date: '',
          timeSpent: '',
          description: '',
          outcomes: '',
          link: ''
        });
      }
    } else {
      setFormState({
        date: '',
        timeSpent: '',
        description: '',
        outcomes: '',
        link: ''
      });
    }
  }, [meeting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedDate = new Date(formState.date).toISOString();
      if (meeting) {
        // Edytuj istniejące spotkanie
        await axios.put(`${apiServerUrl}/projects/meeting/${meeting.meeting_id}`, {
          date: formattedDate,
          time_spent: Number(formState.timeSpent),
          meeting_description: formState.description,
          meeting_outcomes: formState.outcomes,
          meeting_link: formState.link
        });
        onSave({
          ...meeting,
          ...formState
        });
      } else if (projectId) {
        // Dodaj nowe spotkanie
        const response = await axios.post(`${apiServerUrl}/projects/meeting/new`, {
          date: formattedDate,
          time_spent: Number(formState.timeSpent),
          meeting_description: formState.description,
          meeting_outcomes: formState.outcomes,
          meeting_link: formState.link,
          projectMeetings: { project_id: projectId }
        });
        onSave(response.data);
      } else {
        console.error('No project ID provided');
      }
    } catch (error) {
      console.error('Error saving meeting:', error);
    }
  };

  return (
    <div className={styles.meetingFormContainer}>
      <h2>{meeting ? 'Edytuj Spotkanie' : 'Dodaj Spotkanie'}</h2>
      <div className={styles.meetingForm}>
        <label>
          Data:
          <input type="datetime-local" name="date" value={formState.date} onChange={handleChange} />
        </label>
        <label>
          Czas spędzony:
          <input type="number" name="timeSpent" value={formState.timeSpent} onChange={handleChange} />
        </label>
        <label>
          Opis spotkania:
          <textarea name="description" value={formState.description} onChange={handleChange}></textarea>
        </label>
        <label>
          Wyniki spotkania:
          <textarea name="outcomes" value={formState.outcomes} onChange={handleChange}></textarea>
        </label>
        <label>
          Link do spotkania:
          <input type="text" name="link" value={formState.link} onChange={handleChange} />
        </label>
      </div>
      <div className={styles.formButtons}>
        <button className={styles.submitButton} onClick={handleSubmit}>Zapisz</button>
        <button className={styles.cancelButton} onClick={onCancel}>Anuluj</button>
      </div>
    </div>
  );
};

export default MeetingForm;
