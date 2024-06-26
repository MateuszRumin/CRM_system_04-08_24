import React, { useState } from 'react';
import { useData } from '../../../contexts/DataContext';
import styles from './ClientTasks.module.css';

interface Task {
  title: string;
  deadline: string;
  status: string;
  description: string;
}

export function ClientTasks() {
  const { tasks, setTasks } = useData();
  const [newTask, setNewTask] = useState<Task>({
    title: '',
    deadline: '',
    status: 'nieZaczety',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleAddTask = () => {
    if (newTask.title.trim() !== '' && newTask.deadline.trim() !== '' && newTask.description.trim() !== '') {
      setTasks([...tasks, newTask]);
      setNewTask({
        title: '',
        deadline: '',
        status: 'nieZaczety',
        description: '',
      });
      simulateDataSend(newTask);
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
              <label className={styles.titleFormField} >Tytuł zadania</label>
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.titleFormField} >Termin zadania</label>
              <input
                type="date"
                name="deadline"
                value={newTask.deadline}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.titleFormField} >Status zadania</label>
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
            </div>
          </div>
          <div className={styles.richTextEditor}>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleChange}
              placeholder="Wpisz opis zadania..."
              className={styles.textAreaField}
            ></textarea>
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
};