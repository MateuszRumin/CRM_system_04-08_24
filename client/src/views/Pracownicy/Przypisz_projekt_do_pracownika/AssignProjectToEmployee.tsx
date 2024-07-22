import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { EmployeeTable } from '../../../components/Employee/AssignProjectToEmployeeComponents/EmployeeTable';
import Pagination from '../../../components/Employee/Pagination';
import styles from './AssignProjectToEmployee.module.css';
import BlueButton from '../../../components/Buttons/BlueButton';


interface Project {
  project_id: string;
  name: string;
  client_id: string;
  status_id: string;
  created_at: string;
}

export function AssignProjectToEmployee() {
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
        const response = await axios.get(`http://localhost:3000/projects/without/${employee?.id}`);
        const projectsData = response.data;
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [employee?.id]);

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

  const handleAssignClick = async () => {
    try {
      const projectsData = selectedProjects.map(id => ({ project_id: parseInt(id, 10) }));
      for (const project of projectsData) {
        await axios.post(`http://localhost:3000/employees/${employee?.id}/project/assign`, project);
      }
  
      navigate(`/pracownicy`);
      console.log('Projects assigned successfully');
    } catch (error) {
      console.error('Error assigning projects:', error);
    }
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
