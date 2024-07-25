// TaskForm.tsx
import React, { useState } from 'react';
import styles from './TaskForm.module.css';

interface TaskFormProps {
  task?: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
  employeesList: string[];
}

interface Task {
  id?: number;
  taskName: string;
  hours: string;
  status: string;
  date: string;
  employees: string[];
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, employeesList }) => {
  const [formState, setFormState] = useState<Task>({
    taskName: task?.taskName || '',
    hours: task?.hours || '',
    status: task?.status || '',
    date: task?.date || '',
    employees: task?.employees || [],
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
      const newEmployees = checked 
        ? [...prevState.employees, value]
        : prevState.employees.filter(emp => emp !== value);
      return {
        ...prevState,
        employees: newEmployees,
      };
    });
  };

  const handleSubmit = () => {
    onSave({ ...formState, id: task?.id });
  };

  return (
    <div className={styles.taskFormContainer}>
      <h2>{task ? 'Edytuj Zadanie' : 'Dodaj Zadanie'}</h2>
      <div className={styles.taskForm}>
        <label>
          Nazwa zadania:
          <input type="text" name="taskName" value={formState.taskName} onChange={handleChange} />
        </label>
        <label>
          Ilość godzin:
          <input type="text" name="hours" value={formState.hours} onChange={handleChange} />
        </label>
        <label>
          Status:
          <select name="status" value={formState.status} onChange={handleChange}>
            <option value="W trakcie">W trakcie</option>
            <option value="Zakończone">Zakończone</option>
            <option value="Opóźnione">Opóźnione</option>
          </select>
        </label>
        <label>
          Termin wykonania:
          <input type="date" name="date" value={formState.date} onChange={handleChange} />
        </label>
        <label>
          Pracownicy:
          <div className={styles.checkboxGroup}>
            {employeesList.map(emp => (
              <label key={emp}>
                <input 
                  type="checkbox" 
                  value={emp} 
                  checked={formState.employees.includes(emp)} 
                  onChange={handleCheckboxChange} 
                />
                {emp}
              </label>
            ))}
          </div>
        </label>
      </div>
      <div className={styles.formButtons}>
        <button className={styles.submitButton} onClick={handleSubmit}>Zapisz</button>
        <button className={styles.cancelButton} onClick={onCancel}>Anuluj</button>
      </div>
    </div>
  );
};

export default TaskForm;
