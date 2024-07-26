import React, { useState } from 'react';
import styles from './TaskForm.module.css';

interface TaskFormProps {
  task?: any;
  onSave: (task: any) => void;
  onCancel: () => void;
  employeesList: string[];
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, employeesList }) => {
  const [formState, setFormState] = useState({
    task_name: task?.task_name || '',
    predicted_time: task?.predicted_time || '',
    status: task?.status || '',
    deadline: task?.deadline || '',
    assignedUsers: task?.assignedUsers || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormState((prevState) => {
      const newAssignedUsers = checked 
        ? [...prevState.assignedUsers, value]
        : prevState.assignedUsers.filter(emp => emp !== value);
      return {
        ...prevState,
        assignedUsers: newAssignedUsers,
      };
    });
  };

  const handleSubmit = () => {
    onSave(formState);
  };

  return (
    <div className={styles.taskFormContainer}>
      <h2>{task ? 'Edytuj Zadanie' : 'Dodaj Zadanie'}</h2>
      <div className={styles.taskForm}>
        <label>
          Nazwa zadania:
          <input type="text" name="task_name" value={formState.task_name} onChange={handleChange} />
        </label>
        <label>
          Ilość godzin:
          <input type="text" name="predicted_time" value={formState.predicted_time} onChange={handleChange} />
        </label>
        <label>
          Status:
          <select name="status" value={formState.status} onChange={handleChange}>
            <option value="Nie zaczęty">Nie zaczęty</option>
            <option value="W trakcie">W trakcie</option>
            <option value="Zakończone">Zakończone</option>
            <option value="Opóźnione">Opóźnione</option>
          </select>
        </label>
        <label>
          Termin wykonania:
          <input type="date" name="deadline" value={formState.deadline} onChange={handleChange} />
        </label>
        <label>
          Pracownicy:
          <div className={styles.checkboxGroup}>
            {employeesList.map(emp => (
              <label key={emp}>
                <input 
                  type="checkbox" 
                  value={emp} 
                  checked={formState.assignedUsers.includes(emp)} 
                  onChange={handleCheckboxChange} 
                />
                {emp}
              </label>
            ))}
          </div>
        </label>
        <div className={styles.buttons}>
          <button onClick={handleSubmit}>{task ? 'Zapisz' : 'Dodaj'}</button>
          <button onClick={onCancel}>Anuluj</button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
