import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EmployeeTable } from '../../../components/Employee/AssignProjectToEmployeeComponents/EmployeeTable';
import Pagination from '../../../components/Employee/Pagination';
import styles from './AssignProjectToEmployee.module.css';
import BlueButton from '../../../components/Buttons/BlueButton';

interface Project {
  id: string;
  projectName: string;
  clientName: string;
  status: string;
  deadline: string;
}

export function AssignProjectToEmployee() {
  const location = useLocation();
  const employee = location.state?.employee;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', projectName: 'Projekt A', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
    { id: '2', projectName: 'Projekt B', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
    { id: '3', projectName: 'Projekt C', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
    { id: '4', projectName: 'Projekt D', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
    { id: '5', projectName: 'Projekt E', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
    { id: '6', projectName: 'Projekt F', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
    { id: '7', projectName: 'Projekt G', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
    { id: '8', projectName: 'Projekt H', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
    { id: '9', projectName: 'Projekt I', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
    { id: '10', projectName: 'Projekt J', clientName: 'Adam Nowak', status: 'W trakcie realizacji', deadline: '12.12.2024' },
  ]); // Symulowane dane projektów

  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  useEffect(() => {
    // Reset selectedProjects when projects change
    setSelectedProjects([]);
  }, [projects]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const changeItemsPerPage = (newItemsPerPage: number) => setItemsPerPage(newItemsPerPage);

  const handleCheckboxChange = (isChecked: boolean, projectId: string) => {
    if (isChecked) {
      setSelectedProjects((prevSelected) => [...prevSelected, projectId]);
    } else {
      setSelectedProjects((prevSelected) => prevSelected.filter((id) => id !== projectId));
    }
  };

  const handleAssignClick = () => {
    // Prepare data for submission
    const data = {
      employeeId: employee?.id,
      projects: projects.filter((project) => selectedProjects.includes(project.id))
    };
    console.log('Submitted data:', data);
    // Tutaj implementacja z API
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h2>Przypisz projekt do pracownika {employee ? `${employee.name}, ${employee.id}` : ''}</h2>
        <BlueButton
          buttonText='Przypisz'
          disabled={selectedProjects.length === 0}
          onClickAction={handleAssignClick}
        />
      </div>
      <EmployeeTable
        data={currentItems}
        onCheckboxChange={handleCheckboxChange}
        selectedProjects={selectedProjects}
      />
      <Pagination
        itemsPerPageOptions={[5, 10, 20]}
        itemsPerPage={itemsPerPage}
        totalItems={projects.length}
        currentPage={currentPage}
        paginate={paginate}
        changeItemsPerPage={changeItemsPerPage}
      />
    </div>
  );
}
