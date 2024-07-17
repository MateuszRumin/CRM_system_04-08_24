import React from 'react';
import styles from './TaskList.module.css';

const TasksList: React.FC = () => {
  const tasks = [
    { taskName: 'Projekt A', status: 'W trakcie', date: '12.12.2024' },
    { taskName: 'Projekt B', status: 'W trakcie', date: '12.12.2024' },
    { taskName: 'Projekt X', status: 'W trakcie', date: '12.12.2024' },
    { taskName: 'Projekt Y', status: 'W trakcie', date: '12.12.2024' },
    { taskName: 'Projekt A', status: 'W trakcie', date: '12.12.2024' },
    { taskName: 'Projekt Z', status: 'W trakcie', date: '12.12.2024' },
  ];

  return (
    <div className={styles.tasks}>
      <h2>Lista zadań</h2>
      <table className={styles.tasksTable}>
        <thead>
          <tr>
            <th>Nazwa zadania</th>
            <th>Status</th>
            <th>Termin</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task.taskName}</td>
              <td>{task.status}</td>
              <td>{task.date}</td>
              <td>
                <button className={styles.detailsButton}>Szczegóły</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.addButton}>Dodaj</button>
    </div>
  );
};

export default TasksList;
