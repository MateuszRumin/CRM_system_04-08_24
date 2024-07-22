import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';  
import { EmployeeTable } from '../../../components/Employee/RemoveEmployeeComponents/EmployeeTable';
import Pagination from '../../../components/Employee/Pagination';
import styles from './RemoveEmployee.module.css';
import BlueButton from '../../../components/Buttons/BlueButton';

// Definiowanie interfejsu Project lokalnie
interface Project {
  project_id: string;
  name: string;
  client_id: string;
  status_id: string;
  created_at: string;
}

export function RemoveEmployee() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const employee = location.state?.employee;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/projects/with/${employee?.id}`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [employee?.id]);

  useEffect(() => {
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

  const handleRemoveClick = async () => {
    try {
      for (const projectId of selectedProjects) {
        await axios.delete(`http://localhost:3000/employees/${employee?.id}/project/remove`, {
          data: { project_id: parseInt(projectId, 10) }
        });
      }
      navigate('/pracownicy');
      console.log('Projects removed successfully');
    } catch (error) {
      console.error('Error removing projects:', error);
    }
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
        totalItems={projects.length}
        currentPage={currentPage}
        paginate={paginate}
        changeItemsPerPage={changeItemsPerPage}
      />
    </div>
  );
}
