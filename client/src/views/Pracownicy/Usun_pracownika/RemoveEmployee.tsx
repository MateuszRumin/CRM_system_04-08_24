import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { EmployeeTable } from '../../../components/Employee/RemoveEmployeeComponents/EmployeeTable';
import Pagination from '../../../components/Employee/Pagination';
import styles from './RemoveEmployee.module.css';

const dummyData = [
  { projectName: 'Projekt A', clientName: 'Adam Nowak', status: 'Wykonane', deadline: '12.12.2024' },
  { projectName: 'Projekt C', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { projectName: 'Projekt D', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { projectName: 'Projekt E', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { projectName: 'Projekt F', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { projectName: 'Projekt G', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { projectName: 'Projekt H', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { projectName: 'Projekt I', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
];

export function RemoveEmployee() {
  const location = useLocation();
  const employee = location.state?.employee;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Paginacja
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dummyData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const changeItemsPerPage = (newItemsPerPage: number) => setItemsPerPage(newItemsPerPage);

  return (
    <div className={styles.container}>
      <h2>Usuń pracownika {employee ? `${employee.name}, ${employee.id}` : ''}</h2>
      <EmployeeTable data={currentItems} />
      <Pagination
        itemsPerPageOptions={[5, 10, 15]}
        itemsPerPage={itemsPerPage}
        totalItems={dummyData.length}
        currentPage={currentPage}
        paginate={paginate}
        changeItemsPerPage={changeItemsPerPage}
      />
    </div>
  );
}
