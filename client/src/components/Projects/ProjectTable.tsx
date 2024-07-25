import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProjectTable.module.css';
import { ProjectRow } from './ProjectRow';
import Pagination from '../Client/Pagination';

interface Note {
  note_id: string;
  note_text: string;
  timestamp: string;
}

interface Project {
  project_id: number;
  name: string;
  description: string;
  client_id: number;
  status_id: number;
  created_at: string;
  updated_at: string;
  notes: Note[];
}

interface ProjectTableProps {
  searchTerm: string;
  filterOptions: { [key: string]: string };
}

export const ProjectTable: React.FC<ProjectTableProps> = ({ searchTerm, filterOptions }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const itemsPerPageOptions: number[] = [10, 20, 30, 50];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/projects/');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let results = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (Object.keys(filterOptions).length > 0) {
      results = results.filter(project => {
        return Object.entries(filterOptions).every(([key, value]) => {
          if (typeof value === 'string') {
            return project[key as keyof Project]?.toString().toLowerCase().includes(value.toLowerCase());
          } else {
            return project[key as keyof Project] === value;
          }
        });
      });
    }

    setFilteredProjects(results);
    setCurrentPage(1);
  }, [searchTerm, filterOptions, projects]);

  const indexOfLastProject: number = currentPage * itemsPerPage;
  const indexOfFirstProject: number = indexOfLastProject - itemsPerPage;
  const currentProjects: Project[] = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleDeleteProject = (projectId: number) => {
    setProjects(prevProjects => prevProjects.filter(project => project.project_id !== projectId));
    setFilteredProjects(prevProjects => prevProjects.filter(project => project.project_id !== projectId));
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Status</th>
            <th>Klient</th>
            <th>Data rozpoczęcia</th>
            <th>Data zakończenia</th>
            <th>Więcej</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map((project) => (
            <ProjectRow key={project.project_id} project={project} onDelete={handleDeleteProject} />
          ))}
        </tbody>
      </table>
      <div>
        <Pagination
          itemsPerPageOptions={itemsPerPageOptions}
          itemsPerPage={itemsPerPage}
          totalItems={filteredProjects.length}
          currentPage={currentPage}
          paginate={paginate}
          changeItemsPerPage={changeItemsPerPage}
        />
      </div>
    </div>
  );
};
