import React, { useState, useEffect } from 'react';
import { useData } from '../../../contexts/DataContext';
import styles from './ClientTasks.module.css';

interface Task {
  task_id: number;
  task_title: string;
  task_deadline: string;
  task_status: string;
  task_description: string;
}

interface ClientTasksProps {
  tasks: Task[];
}

export function ClientTasks({ tasks: initialTasks }: ClientTasksProps) {
  const { addTask, updateTask, deleteTask, setValidTasks } = useData();
  const [localTasks, setLocalTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState<Task>({
    task_id: localTasks.length + 1, // Generowanie nowego ID, lepszym podejściem byłoby generowanie na serwerze
    task_title: '',
    task_deadline: '',
    task_status: 'Nie zaczęty',
    task_description: '',
  });
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (isEditing) {
      setValidTasks(false);
    } else {
      setValidTasks(true);
    }
  }, [isEditing, setValidTasks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingTaskId !== null && editedTask) {
      setEditedTask({ ...editedTask, [name]: value });
    } else {
      setNewTask(prevTask => ({ ...prevTask, [name]: value }));
    }
    setIsEditing(true); // Set isEditing to true on any change
  };

  const handleAddTask = () => {
    if (validateForm()) {
      setLocalTasks([...localTasks, newTask]);
      addTask(newTask);
      setNewTask({
        task_id: localTasks.length + 1,
        task_title: '',
        task_deadline: '',
        task_status: 'Nie zaczęty',
        task_description: '',
      });
      setIsEditing(false); // Set isEditing to false after adding task
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.task_id);
    setEditedTask(task);
    setIsEditing(true); // Set isEditing to true when editing a task
  };

  const handleSaveEditedTask = () => {
    if (editedTask && validateForm(editedTask)) {
      const updatedLocalTasks = localTasks.map(task =>
        task.task_id === editedTask.task_id ? editedTask : task
      );
      setLocalTasks(updatedLocalTasks);

      updateTask(editedTask);

      setEditingTaskId(null);
      setEditedTask(null);
      setIsEditing(false); // Set isEditing to false after saving edited task
    }
  };

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({
    task_title: '',
    task_deadline: '',
    task_status: '',
    task_description: '',
  });

  const validateForm = (task: Task = newTask): boolean => {
    let valid = true;
    const errors: { [key: string]: string } = {};
  
    if (task.task_title.trim() === '') {
      errors['task_title'] = 'Pole tytułu jest wymagane';
      valid = false;
    }
    if (task.task_deadline.trim() === '') {
      errors['task_deadline'] = 'Pole terminu jest wymagane';
      valid = false;
    } else {
      const today = new Date();
      const deadlineDate = new Date(task.task_deadline);
      if (deadlineDate <= today) {
        errors['task_deadline'] = 'Termin zadania musi być w przyszłości';
        valid = false;
      }
    }
    if (task.task_status === '') {
      errors['task_status'] = 'Wybierz status zadania';
      valid = false;
    }
    if (task.task_description.trim() === '') {
      errors['task_description'] = 'Pole opisu jest wymagane';
      valid = false;
    }
  
    setFormErrors(errors);
    return valid;
  };

  const handleDeleteTask = (taskId: number) => {
    const updatedLocalTasks = localTasks.filter(task => task.task_id !== taskId);
    setLocalTasks(updatedLocalTasks);

    deleteTask(taskId);
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
                name="task_title"
                value={editingTaskId !== null && editedTask ? editedTask.task_title : newTask.task_title}
                onChange={handleChange}
                className={styles.inputField}
              />
              {formErrors.task_title && <p className={styles.error}>{formErrors.task_title}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.titleFormField}>Termin zadania</label>
              <input
                type="date"
                name="task_deadline"
                value={editingTaskId !== null && editedTask ? editedTask.task_deadline : newTask.task_deadline}
                onChange={handleChange}
                className={styles.inputField}
              />
              {formErrors.task_deadline && <p className={styles.error}>{formErrors.task_deadline}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.titleFormField}>Status zadania</label>
              <select
                name="task_status"
                value={editingTaskId !== null && editedTask ? editedTask.task_status : newTask.task_status}
                onChange={handleChange}
                className={styles.inputField}
              >
                <option value="">Wybierz status</option>
                <option value="Nie zaczęty">Nie zaczęty</option>
                <option value="W trakcie">W trakcie</option>
                <option value="Zrobiony">Zrobiony</option>
                <option value="Nie zrobiony (porażka)">Nie zrobiony (porażka)</option>
              </select>
              {formErrors.task_status && <p className={styles.error}>{formErrors.task_status}</p>}
            </div>
          </div>
          <div className={styles.richTextEditor}>
            <textarea
              name="task_description"
              value={editingTaskId !== null && editedTask ? editedTask.task_description : newTask.task_description}
              onChange={handleChange}
              placeholder="Wpisz opis zadania..."
              className={styles.textAreaField}
            ></textarea>
            {formErrors.task_description && <p className={styles.error}>{formErrors.task_description}</p>}
          </div>
          {editingTaskId !== null ? (
            <button
              type="button"
              onClick={handleSaveEditedTask}
              className={styles.addButton}
            >
              Zapisz zmiany
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddTask}
              className={styles.addButton}
            >
              Dodaj zadanie
            </button>
          )}
        </div>
      </div>
      <div className={styles.tasks}>
        {localTasks.map((task) => (
          <div key={task.task_id} className={styles.task}>
            <h3>{task.task_title}</h3>
            <p><strong>Termin:</strong> {task.task_deadline}</p>
            <p><strong>Status:</strong> {task.task_status}</p>
            <p>{task.task_description}</p>
            <div className={styles.button_container}>
            <button className={styles.addButton}
             onClick={() => handleEditTask(task)}>
              Edytuj
            </button>
            <button className={styles.addButton}
             onClick={() => handleDeleteTask(task.task_id)}>
              Usuń
            </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
