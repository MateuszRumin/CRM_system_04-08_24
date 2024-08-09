import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AssignedEmployeesModal.module.css';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface AssignedEmployeesModalProps {
  projectId: number;
}

interface Employee {
  user_id: number;
  username: string;
  UserData: {
    first_name: string;
    second_name: string;
    Position: {
      name: string;
    };
  }[];
}

export const AssignedEmployeesModal: React.FC<AssignedEmployeesModalProps> = ({ projectId }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    axios.get(`${apiServerUrl}/projects/${projectId}/users`)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, [projectId]);

  return (
    <div className={styles.container}>
      <h2>Pracownicy przypisani do projektu</h2>
      {employees.length === 0 ? (
        <p>Brak przypisanych pracowników</p>
      ) : (
        <ul className={styles.employeeList}>
          {employees.map(employee => (
            <li key={employee.user_id} className={styles.employeeItem}>
              <p><strong>Imię:</strong> {employee.UserData[0]?.first_name || 'Brak imienia'}</p>
              <p><strong>Nazwisko:</strong> {employee.UserData[0]?.second_name || 'Brak nazwiska'}</p>
              <p><strong>Pozycja:</strong> {employee.UserData[0]?.Position.name || 'Brak pozycji'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
