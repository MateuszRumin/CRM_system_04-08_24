import React from 'react';
import { EmployeeRow } from './EmployeeRow';
import styles from './EmployeeTable.module.css';

interface EmployeeTableProps {
  data: any[];
  onCheckboxChange: (isChecked: boolean, projectId: string) => void;
  selectedProjects: string[];
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ data, onCheckboxChange, selectedProjects }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Nazwa projektu</th>
          <th>Nazwa klienta</th>
          <th>Status</th>
          <th>Termin</th>
          <th>Zaznacz</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <EmployeeRow
            key={index}
            project={item}
            isChecked={selectedProjects.includes(item.id)}
            onCheckboxChange={onCheckboxChange}
          />
        ))}
      </tbody>
    </table>
  );
};
