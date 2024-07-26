import React from 'react';
import styles from './TaskDetails.module.css';

interface TaskDetailsProps {
  task: any;
  onClose: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onClose }) => {
  return (
    <div className={styles.taskDetailsContainer}>
      <h2>Szczegóły Zadania</h2>
      <div className={styles.taskDetails}>
        <p><strong>Nazwa zadania:</strong> {task.task_name}</p>
        <p><strong>Ilość godzin:</strong> {task.predicted_time}</p>
        <p><strong>Status:</strong> {task.Status.name}</p>
        <p><strong>Termin wykonania:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
        <p><strong>Lista przypisanych pracowników:</strong></p>
        <ul>
          {task.assignedUsers.map((emp: string, index: number) => (
            <li key={index}>{emp}</li>
          ))}
        </ul>
      </div>
      <button className={styles.closeButton} onClick={onClose}>Zamknij</button>
    </div>
  );
};

export default TaskDetails;
