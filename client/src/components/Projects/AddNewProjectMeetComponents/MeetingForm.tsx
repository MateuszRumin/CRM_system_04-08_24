import React, { useState } from 'react';
import styles from './MettingForm.module.css';

interface MeetingFormProps {
  meeting?: any;
  onSave: (meeting: any) => void;
  onCancel: () => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ meeting, onSave, onCancel }) => {
  const [formState, setFormState] = useState({
    projectName: meeting?.projectName || '',
    timeSpent: meeting?.timeSpent || '',
    date: meeting?.date || '',
    link: meeting?.link || '',
    description: meeting?.description || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSave({ ...formState, id: meeting?.id });
  };

  return (
    <div className={styles.meetingFormContainer}>
      <h2>{meeting ? 'Edytuj Spotkanie' : 'Dodaj Spotkanie'}</h2>
      <div className={styles.meetingForm}>
        <label>
          Nazwa spotkania:
          <input type="text" name="projectName" value={formState.projectName} onChange={handleChange} />
        </label>
        <label>
          Czas spędzony:
          <input type="text" name="timeSpent" value={formState.timeSpent} onChange={handleChange} />
        </label>
        <label>
          Data:
          <input type="date" name="date" value={formState.date} onChange={handleChange} />
        </label>
        <label>
          Link do spotkania:
          <input type="text" name="link" value={formState.link} onChange={handleChange} />
        </label>
        <label>
          Opis spotkania:
          <textarea name="description" value={formState.description} onChange={handleChange}></textarea>
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
