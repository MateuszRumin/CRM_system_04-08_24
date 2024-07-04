import React, { useState, useEffect } from 'react';
import { useData } from '../../../contexts/DataContext';
import styles from './ClientTasks.module.css';

interface Task {
  title: string;
  deadline: string;
  status: string;
  description: string;
}

export function ClientTasks() {
  const { tasks, setTasks, isValidTasks, setValidTasks } = useData();
  const [newTask, setNewTask] = useState<Task>({
    title: '',
    deadline: '',
    status: 'Nie zaczęty',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    title: '',
    deadline: '',
    status: '',
    description: '',
  });

  // Synchronize isValidTasks with isEditing
  useEffect(() => {
    if (isEditing) {
      setValidTasks(false);
    } else {
      setValidTasks(true);
    }
  }, [isEditing, setValidTasks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prevTask => ({ ...prevTask, [name]: value }));
    setIsEditing(true); // Set isEditing to true on any change
  };

  const validateFields = () => {
    const { title, deadline, status, description } = newTask;
    const errorsCopy = { ...errors };

    if (title.trim() === '') {
      errorsCopy.title = 'Proszę uzupełnić tytuł zadania.';
    } else {
      errorsCopy.title = '';
    }

    if (deadline.trim() === '') {
      errorsCopy.deadline = 'Proszę ustawić termin zadania.';
    } else {
      errorsCopy.deadline = '';
    }

    if (status.trim() === '') {
      errorsCopy.status = 'Proszę wybrać status zadania.';
    } else {
      errorsCopy.status = '';
    }

    if (description.trim() === '') {
      errorsCopy.description = 'Proszę uzupełnić opis zadania.';
    } else {
      errorsCopy.description = '';
    }

    setErrors(errorsCopy);

    return (
      errorsCopy.title === '' &&
      errorsCopy.deadline === '' &&
      errorsCopy.status === '' &&
      errorsCopy.description === ''
    );
  };

  const handleAddTask = () => {
    const fieldsValid = validateFields();

    if (fieldsValid) {
      setTasks([...tasks, newTask]);
      setNewTask({
        title: '',
        deadline: '',
        status: 'Nie zaczęty',
        description: '',
      });
      simulateDataSend(newTask);
      setIsEditing(false); // Set isEditing to false after adding task
    }
  };

  const simulateDataSend = (task: Task) => {
    console.log('Symulacja wysłania danych do serwera - Zadanie:', task);
  };

  return (
    <div className={styles.tasksContainer}>
      <h2>Zadania</h2>
      <div className={styles.taskFormFields}>
        <div className={styles.taskForm}>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.titleFormField}>Tytuł zadania</label>
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                className={styles.inputField}
              />
              {errors.title && <p className={styles.error}>{errors.title}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.titleFormField}>Termin zadania</label>
              <input
                type="date"
                name="deadline"
                value={newTask.deadline}
                onChange={handleChange}
                className={styles.inputField}
              />
              {errors.deadline && <p className={styles.error}>{errors.deadline}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.titleFormField}>Status zadania</label>
              <select
                name="status"
                value={newTask.status}
                onChange={handleChange}
                className={styles.inputField}
              >
                <option value="Nie zaczęty">Nie zaczęty</option>
                <option value="W trakcie">W trakcie</option>
                <option value="Zrobiony">Zrobiony</option>
                <option value="Nie zrobiony (porażka)">Nie zrobiony (porażka)</option>
              </select>
              {errors.status && <p className={styles.error}>{errors.status}</p>}
            </div>
          </div>
          <div className={styles.richTextEditor}>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleChange}
              className={styles.textAreaField}
            ></textarea>
            {errors.description && <p className={styles.error}>{errors.description}</p>}
          </div>
          <button
            type="button"
            onClick={handleAddTask}
            className={styles.addButton}
          >
            Zapisz zadanie
          </button>
        </div>
      </div>
      <div className={styles.tasks}>
        {tasks.map((task, index) => (
          <div key={index} className={styles.task}>
            <h3>{task.title}</h3>
            <p><strong>Termin:</strong> {task.deadline}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
