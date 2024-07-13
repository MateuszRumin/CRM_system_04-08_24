import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EmployeeTable } from '../../../components/Employee/RemoveEmployeeComponents/EmployeeTable';
import Pagination from '../../../components/Employee/Pagination';
import styles from './RemoveEmployee.module.css';
import BlueButton from '../../../components/Buttons/BlueButton';

interface Project {
  id: string;
  projectName: string;
  clientName: string;
  status: string;
  deadline: string;
}

const dummyData: Project[] = [
  { id: '1', projectName: 'Projekt A', clientName: 'Adam Nowak', status: 'Wykonane', deadline: '12.12.2024' },
  { id: '2', projectName: 'Projekt B', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { id: '3', projectName: 'Projekt C', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { id: '4', projectName: 'Projekt D', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { id: '5', projectName: 'Projekt E', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { id: '6', projectName: 'Projekt F', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { id: '7', projectName: 'Projekt G', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { id: '8', projectName: 'Projekt H', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  { id: '9', projectName: 'Projekt I', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
];

export function RemoveEmployee() {
  const location = useLocation();
  const employee = location.state?.employee;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  useEffect(() => {
    // Reset selectedProjects when projects change
    setSelectedProjects([]);
  }, [dummyData]);

  // Paginacja
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dummyData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const changeItemsPerPage = (newItemsPerPage: number) => setItemsPerPage(newItemsPerPage);

  const handleCheckboxChange = (isChecked: boolean, projectId: string) => {
    if (isChecked) {
      setSelectedProjects((prevSelected) => [...prevSelected, projectId]);
    } else {
      setSelectedProjects((prevSelected) => prevSelected.filter((id) => id !== projectId));
    }
  };

  const handleRemoveClick = () => {
    // Prepare data for submission
    const data = {
      employeeId: employee?.id,
      projects: dummyData.filter((project) => selectedProjects.includes(project.id))
    };
    console.log('Submitted data:', data);
    // Tutaj implementacja z API
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h2>Usuń pracownika {employee ? `${employee.name}, ${employee.id}` : ''}</h2>
        <BlueButton
          buttonText='Usuń z projektu'
          disabled={selectedProjects.length === 0}
          onClickAction={handleRemoveClick}
        />
      </div>
      <EmployeeTable
        data={currentItems}
        onCheckboxChange={handleCheckboxChange}
        selectedProjects={selectedProjects}
      />
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
