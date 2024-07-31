import React, { useState, useEffect } from 'react';
import styles from './TaskForm.module.css';

interface TaskFormProps {
  task?: any; // Typ zadania może być bardziej precyzyjny, jeśli znasz dokładną strukturę
  onSave: (task: any) => void;
  onCancel: () => void;
  employeesList: {
    user_id: number;
    username: string;
    UserData: {
      first_name: string;
      second_name: string;
    }[];
  }[];
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, employeesList }) => {
  const [formState, setFormState] = useState({
    task_name: '',
    predicted_time: '',
    task_text: '',
    deadline: '',
    assignedUsers: [] as string[], // Użyj tablicy stringów dla identyfikatorów użytkowników
  });

  useEffect(() => {
    if (task) {
      console.log('Received task:', task); // Debugowanie
      const assignedUsers = task.ProjectTask
        ? task.ProjectTask.flatMap((pt: any) =>
            pt.TaskAssignment ? pt.TaskAssignment.map((ta: any) => ta.user_id.toString()) : []
          )
        : [];
      setFormState({
        task_name: task.task_name || '',
        predicted_time: task.predicted_time !== undefined ? task.predicted_time.toString() : '',
        task_text: task.task_text || '',
        deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
        assignedUsers,
      });
    }
  }, [task]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormState(prevState => {
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
    onSave({
      ...formState,
      predicted_time: parseInt(formState.predicted_time, 10),
      deadline: new Date(formState.deadline).toISOString(),
      assignedUsers: formState.assignedUsers.map(id => parseInt(id, 10)),
    });
  };
  

  return (
    <div className={styles.taskFormContainer}>
      <h2>{task ? 'Edytuj Zadanie' : 'Dodaj Zadanie'}</h2>
      <div className={styles.taskForm}>
        <label>
          Nazwa zadania:
          <input
            type="text"
            name="task_name"
            value={formState.task_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Ilość godzin:
          <input
            type="text"
            name="predicted_time"
            value={formState.predicted_time}
            onChange={handleChange}
          />
        </label>
        <label>
          Opis zadania:
          <textarea
            name="task_text"
            value={formState.task_text}
            onChange={handleChange}
          />
        </label>
        <label>
          Termin wykonania:
          <input
            type="datetime-local"
            name="deadline"
            value={formState.deadline}
            onChange={handleChange}
          />
        </label>
        <label>
          Pracownicy:
          <div className={styles.checkboxGroup}>
            {employeesList.map(emp => (
              <label key={emp.user_id}>
                <input
                  type="checkbox"
                  value={emp.user_id}
                  checked={formState.assignedUsers.includes(emp.user_id.toString())}
                  onChange={handleCheckboxChange}
                />
                {emp.UserData.length > 0 && `${emp.UserData[0].first_name} ${emp.UserData[0].second_name}`}
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
