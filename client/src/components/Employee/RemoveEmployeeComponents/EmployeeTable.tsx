import React from 'react';
import { EmployeeRow } from './EmployeeRow';
import styles from './EmployeeTable.module.css';

interface EmployeeTableProps {
  data: any[];
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ data }) => {
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
          <EmployeeRow key={index} project={item} />
        ))}
      </tbody>
    </table>
  );
};
