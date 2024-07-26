import React, { useState, useEffect } from 'react';
import styles from './TaskList.module.css';
import TaskForm from '../AddNewTaskComponents/TaskForm';
import TaskDetails from '../DetailsTaskProjectComponents/TaskDetails';

interface Task {
  task_id: number;
  task_name: string;
  predicted_time: string;
  status: string;
  deadline: string;
  Status: {
    name: string;
  };
  assignedUsers: string[];
}

const TasksList: React.FC<{ projectId: number }> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [view, setView] = useState<'list' | 'details' | 'edit' | 'add'>('list');

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${projectId}`)
      .then(response => response.json())
      .then(data => setTasks(data.ProjectTask.map((task: any) => task.Task)));
  }, [projectId]);

  const handleAddTask = () => {
    setSelectedTask(null);
    setView('add');
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setView('edit');
  };

  const handleViewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setView('details');
  };

  const handleDeleteTask = (taskId: number) => {
    fetch(`http://localhost:3000/projects/task/${taskId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(() => setTasks(tasks.filter(task => task.task_id !== taskId)))
      .catch(error => console.error('Error:', error));
    setView('list');
  };

  const handleSaveTask = (task: Task) => {
    const method = selectedTask ? 'PUT' : 'POST';
    const url = selectedTask ? `http://localhost:3000/projects/task/${selectedTask.task_id}` : `http://localhost:3000/projects/task/new`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...task,
        project_id: projectId,
        user_id: 1,
      }),
    })
      .then(response => response.json())
      .then((savedTask: Task) => {
        if (selectedTask) {
          setTasks(tasks.map(t => (t.task_id === savedTask.task_id ? savedTask : t)));
        } else {
          setTasks([...tasks, savedTask]);
        }
        setView('list');
      })
      .catch(error => console.error('Error:', error));
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
                  <td>{task.task_name}</td>
                  <td>{task.predicted_time}</td>
                  <td>{task.Status.name}</td>
                  <td>{new Date(task.deadline).toLocaleDateString()}</td>
                  <td className={styles.buttonCell}>
                    <button className={styles.detailsButton} onClick={() => handleViewTaskDetails(task)}>Szczegóły</button>
                    <button className={styles.editButton} onClick={() => handleEditTask(task)}>Edytuj</button>
                    <button className={styles.deleteButton} onClick={() => handleDeleteTask(task.task_id)}>Usuń</button>
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
        <TaskForm task={selectedTask} onSave={handleSaveTask} onCancel={handleBackToList} employeesList={[]} />
      )}
    </div>
  );
};

export default TasksList;
