import React from 'react';
import styles from './EmployeeRow.module.css';

interface Project {
  project_id: string;
  name: string;
  client_id: string;
  status_id: string;
  created_at: string;
}

interface EmployeeRowProps {
  project: Project;
  isChecked: boolean;
  onCheckboxChange: (isChecked: boolean, projectId: string) => void;
}

export const EmployeeRow: React.FC<EmployeeRowProps> = ({ project, isChecked, onCheckboxChange }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onCheckboxChange(checked, project.project_id);
  };

  return (
    <tr className={styles.row}>
      <td>{project.name}</td>
      <td>{project.client_id}</td>
      <td>{project.status_id}</td>
      <td>{project.created_at}</td>
      <td>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </td>
    </tr>
  );
};
