import React from 'react';
import styles from './EmployeeRow.module.css';

interface EmployeeRowProps {
  project: any;
}

export const EmployeeRow: React.FC<EmployeeRowProps> = ({ project }) => {
  return (
    <tr className={styles.row}>
      <td>{project.projectName}</td>
      <td>{project.clientName}</td>
      <td>{project.status}</td>
      <td>{project.deadline}</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
  );
};
