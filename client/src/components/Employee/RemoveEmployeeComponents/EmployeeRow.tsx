import React from 'react';
import styles from './EmployeeRow.module.css';

interface EmployeeRowProps {
  project: any;
  isChecked: boolean;
  onCheckboxChange: (isChecked: boolean, projectId: string) => void;
}

export const EmployeeRow: React.FC<EmployeeRowProps> = ({ project, isChecked, onCheckboxChange }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onCheckboxChange(checked, project.id);
  };

  return (
    <tr className={styles.row}>
      <td>{project.projectName}</td>
      <td>{project.clientName}</td>
      <td>{project.status}</td>
      <td>{project.deadline}</td>
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
