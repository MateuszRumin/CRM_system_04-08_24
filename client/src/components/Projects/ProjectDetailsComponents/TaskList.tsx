import React, { useState, useEffect } from 'react';
import styles from './TaskList.module.css';
import TaskForm from '../AddNewTaskComponents/TaskForm';
import TaskDetails from '../DetailsTaskProjectComponents/TaskDetails';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface Task {
  task_id: number;
  task_name: string;
  task_text: string;
  predicted_time: string;
  deadline: string;
  Status?: {
    name: string;
  };
  assignedUsers: number[];
}

interface Employee {
  user_id: number;
  username: string;
  UserData: {
    first_name: string;
    second_name: string;
  }[];
}

const TasksList: React.FC<{ projectId: number }> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [view, setView] = useState<'list' | 'details' | 'edit' | 'add'>('list');
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetch(`${apiServerUrl}/projects/${projectId}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.ProjectTask) {
          const mappedTasks = data.ProjectTask.map((task: any) => {
            const taskDetails = task.Task || {}; // Ensure Task is not undefined
            const assignedUsers = task.TaskAssignment
              ? task.TaskAssignment.map((assignment: any) => assignment.user_id)
              : [];
            return {
              task_id: taskDetails.task_id || 0,
              task_name: taskDetails.task_name || '',
              task_text: taskDetails.task_text || '',
              deadline: taskDetails.deadline || '',
              predicted_time: taskDetails.predicted_time || '',
              assignedUsers,
              Status: task.Status || {}
            };
          });
          setTasks(mappedTasks);
        } else {
          setTasks([]);
        }
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      });
  }, [projectId]);

  useEffect(() => {
    fetch(`${apiServerUrl}/employees`)
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => {
        console.error('Error fetching employees:', error);
        setEmployees([]);
      });
  }, []);

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
    fetch(`${apiServerUrl}/projects/task/${taskId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(() => setTasks(tasks.filter(task => task.task_id !== taskId)))
      .catch(error => console.error('Error:', error));
    setView('list');
  };

  const handleSaveTask = (task: any) => {
    const method = selectedTask ? 'PUT' : 'POST';
    const url = selectedTask
      ? `${apiServerUrl}/projects/task/${selectedTask.task_id}`
      : `${apiServerUrl}/projects/task/new`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...task,
        project_id: projectId,
        user_id: 1, // Assuming the current user's ID is 1
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
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.task_id}>
                    <td>{task.task_name}</td>
                    <td>{task.predicted_time}</td>
                    <td>{task.Status?.name || 'Brak statusu'}</td>
                    <td>{new Date(task.deadline).toLocaleDateString()}</td>
                    <td className={styles.buttonCell}>
                      <button className={styles.detailsButton} onClick={() => handleViewTaskDetails(task)}>Szczegóły</button>
                      <button className={styles.editButton} onClick={() => handleEditTask(task)}>Edytuj</button>
                      <button className={styles.deleteButton} onClick={() => handleDeleteTask(task.task_id)}>Usuń</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Brak zadań do wyświetlenia</td>
                </tr>
              )}
            </tbody>
          </table>
          <button className={styles.addButton} onClick={handleAddTask}>Dodaj</button>
        </>
      )}
      {view === 'details' && selectedTask && (
        <TaskDetails task={selectedTask} onClose={handleBackToList} />
      )}
      {(view === 'edit' || view === 'add') && (
        <TaskForm task={selectedTask} onSave={handleSaveTask} onCancel={handleBackToList} employeesList={employees} />
      )}
    </div>
  );
};

export default TasksList;
