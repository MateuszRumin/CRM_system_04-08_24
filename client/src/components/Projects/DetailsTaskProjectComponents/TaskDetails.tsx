import React from 'react';
import styles from './TaskDetails.module.css';

// Interfejsy opisujące strukturę danych
interface Status {
  status_id: number;
  status_type: string;
  default: boolean;
  name: string;
}

interface Position {
  name: string;
}

interface UserData {
  Position: Position;
}

interface User {
  user_id: number;
  username: string;
  UserData: UserData[];
}

interface TaskAssignment {
  task_assignment_id: number;
  task_project_id: number;
  user_id: number;
  User: User;
}

interface Project {
  project_id: number;
  name: string;
  client_id: number;
  status_id: number;
  description: string;
  created_at: string;
  updated_at: string;
  Status: Status;
  TaskAssignment: TaskAssignment[];
}

interface ProjectTask {
  project_id: number;
  name: string;
  client_id: number;
  status_id: number;
  description: string;
  created_at: string;
  updated_at: string;
  Status: Status;
  TaskAssignment: TaskAssignment[];
}

interface Task {
  task_id: number;
  status_id: number;
  user_id: number;
  task_name: string;
  task_text: string;
  deadline: string;
  created_at: string;
  predicted_time: string; // Dodanie właściwości predicted_time
  days_to_reminder_app: number;
  days_to_reminder_email: number;
  Status: Status;
  ProjectTask: ProjectTask[];
}

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onClose }) => {
  // Konwertowanie daty na obiekt Date
  const deadlineDate = new Date(task.deadline);
  const createdAtDate = new Date(task.created_at);

  // Sprawdzanie poprawności dat
  const isValidDeadlineDate = !isNaN(deadlineDate.getTime());
  const isValidCreatedAtDate = !isNaN(createdAtDate.getTime());

  // Debugowanie danych wejściowych
  console.log('Task details:', task);

  return (
    <div className={styles.taskDetailsContainer}>
      <h2>Szczegóły Zadania</h2>
      <div className={styles.taskDetails}>
        <p><strong>Nazwa zadania:</strong> {task.task_name || 'Brak nazwy'}</p>
        <p><strong>Opis zadania:</strong> {task.task_text || 'Brak opisu'}</p>
        <p><strong>Przewidywany czas:</strong> {task.predicted_time !== undefined ? task.predicted_time : 'Brak czasu'}</p>
        <p><strong>Status:</strong> {task.Status?.name || 'Brak statusu'}</p>
        <p><strong>Termin wykonania:</strong> {isValidDeadlineDate ? deadlineDate.toLocaleDateString() : 'Brak daty'}</p>
        <p><strong>Data utworzenia:</strong> {isValidCreatedAtDate ? createdAtDate.toLocaleDateString() : 'Brak daty'}</p>
      </div>
      <button className={styles.closeButton} onClick={onClose}>Zamknij</button>
    </div>
  );
};

export default TaskDetails;
