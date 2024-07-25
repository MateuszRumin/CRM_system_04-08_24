import React, { useState } from 'react';
import styles from './TaskList.module.css';
import TaskForm from '../AddNewTaskComponents/TaskForm';
import TaskDetails from '../DetailsTaskProjectComponents/TaskDetails';

const initialTasks = [
  { id: 1, taskName: 'Projekt A', hours: '5h', status: 'W trakcie', date: '12.12.2024', employees: ['Jan Kowalski'] },
  { id: 2, taskName: 'Projekt B', hours: '3h', status: 'Zakończone', date: '15.12.2024', employees: [] },
  // Możesz dodać więcej zadań w razie potrzeby
];

const employeesList = [
  'Jan Kowalski',
  'Anna Nowak',
  'Marek Wiśniewski',
  'Maria Kowalczyk',
];

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [view, setView] = useState<'list' | 'details' | 'edit' | 'add'>('list');

  const handleAddTask = () => {
    setSelectedTask(null);
    setView('add');
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setView('edit');
  };

  const handleViewTaskDetails = (task: any) => {
    setSelectedTask(task);
    setView('details');
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setView('list');
  };

  const handleSaveTask = (task: any) => {
    if (selectedTask) {
      setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    } else {
      setTasks([...tasks, { ...task, id: tasks.length + 1 }]);
    }
    setView('list');
  };

  const handleBackToList = () => {
    setView('list');
  };

  return (
    <div className={styles.tasks}>
      <h2>Lista zadań</h2>
      {view === 'list' && (
        <>
          <table className={styles.tasksTable}>
            <thead>
              <tr>
                <th>Nazwa zadania</th>
                <th>Ilość godzin</th>
                <th>Status</th>
                <th>Termin</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.taskName}</td>
                  <td>{task.hours}</td>
                  <td>{task.status}</td>
                  <td>{task.date}</td>
                  <td className={styles.buttonCell}>
                    <button className={styles.detailsButton} onClick={() => handleViewTaskDetails(task)}>Szczegóły</button>
                    <button className={styles.editButton} onClick={() => handleEditTask(task)}>Edytuj</button>
                    <button className={styles.deleteButton} onClick={() => handleDeleteTask(task.id)}>Usuń</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.addButton} onClick={handleAddTask}>Dodaj</button>
        </>
      )}
      {view === 'details' && selectedTask && (
        <TaskDetails task={selectedTask} onClose={handleBackToList} />
      )}
      {(view === 'edit' || view === 'add') && (
        <TaskForm 
          task={selectedTask} 
          onSave={handleSaveTask} 
          onCancel={handleBackToList} 
          employeesList={employeesList}
        />
      )}
    </div>
  );
};

export default TasksList;
