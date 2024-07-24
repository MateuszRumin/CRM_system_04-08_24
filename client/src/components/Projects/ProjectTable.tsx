import React, { useState, useEffect } from 'react';
import styles from './ProjectTable.module.css';
import { ProjectRow } from './ProjectRow';
import Pagination from '../Client/Pagination';

interface Note {
  note_id: string;
  note_text: string;
  timestamp: string;
}

interface Project {
  id: number;
  name: string;
  status: string;
  client: string;
  startDate: string;
  endDate: string;
  notes: Note[];
}

interface ProjectTableProps {
  searchTerm: string;
  filterOptions: { [key: string]: string };
}

const exampleProjects: Project[] = [
  {
    id: 1,
    name: 'Projekt Alpha',
    status: 'Nie rozpoczęty',
    client: 'Klient B',
    startDate: '2023-01-01',
    endDate: '2023-02-02',
    notes: [
      { note_id: '1', note_text: 'Notatka do projektu Alpha 1', timestamp: '2023-01-10' },
      { note_id: '2', note_text: 'Notatka do projektu Alpha 2', timestamp: '2023-01-15' },
    ],
  },
  {
    id: 2,
    name: 'Projekt Beta',
    status: 'W trakcie',
    client: 'Klient B',
    startDate: '2023-02-01',
    endDate: '2023-02-02',
    notes: [
      { note_id: '3', note_text: 'Notatka do projektu Beta 1', timestamp: '2023-02-10' },
    ],
  },
  {
    id: 3,
    name: 'Projekt Gamma',
    status: 'Zakończony',
    client: 'Klient C',
    startDate: '2023-03-01',
    endDate: '2023-02-02',
    notes: [],
  },
  // Dodaj notatki do pozostałych projektów
  {
    id: 4,
    name: 'Projekt Alpha',
    status: 'Nie rozpoczęty',
    client: 'Klient B',
    startDate: '2023-01-01',
    endDate: '2023-02-02',
    notes: [
      { note_id: '4', note_text: 'Notatka do projektu Alpha 1', timestamp: '2023-01-10' },
      { note_id: '5', note_text: 'Notatka do projektu Alpha 2', timestamp: '2023-01-15' },
    ],
  },
  {
    id: 5,
    name: 'Projekt Beta',
    status: 'W trakcie',
    client: 'Klient B',
    startDate: '2023-02-01',
    endDate: '2023-05-02',
    notes: [
      { note_id: '6', note_text: 'Notatka do projektu Beta 1', timestamp: '2023-02-10' },
    ],
  },
  {
    id: 6,
    name: 'Projekt Gamma',
    status: 'Zakończony',
    client: 'Klient C',
    startDate: '2023-03-01',
    endDate: '2023-07-02',
    notes: [],
  },
];


export const ProjectTable: React.FC<ProjectTableProps> = ({ searchTerm, filterOptions }) => {
  const [projects, setProjects] = useState<Project[]>(exampleProjects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(exampleProjects);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const itemsPerPageOptions: number[] = [10, 20, 30, 50];

  useEffect(() => {
    let results = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (Object.keys(filterOptions).length > 0) {
      results = results.filter(project => {
        return Object.entries(filterOptions).every(([key, value]) => {
          if (typeof value === 'string') {
            return project[key as keyof Project].toString().toLowerCase().includes(value.toLowerCase());
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
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
    setFilteredProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
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
            <ProjectRow key={project.id} project={project} onDelete={handleDeleteProject} />
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