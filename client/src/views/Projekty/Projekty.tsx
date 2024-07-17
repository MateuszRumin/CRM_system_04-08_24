import { useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { ProjectTable } from '../../components/Projects/ProjectTable';
import { SearchProject } from '../../components/Projects/SearchProject';
import { FilterProject } from '../../components/Projects/FilterProject';
import { AddNewProjectButton } from '../../components/Projects/AddNewProjectButton';
import styles from './Projekty.module.css';

export const Projekty = () => {
  const location = useLocation();
  const { name } = useParams();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>({});

  const isAddProjectRoute = location.pathname.includes('add-project');
  const isEditProjectRoute = location.pathname.includes('edit-project');

  return (
    <div>
      {!name && !isAddProjectRoute && !isEditProjectRoute && (
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Projekty</h1>
            <div className={styles.actions}>
              <SearchProject onSearch={setSearchTerm} />
              <FilterProject onFilter={setFilterOptions} />
              <AddNewProjectButton />
            </div>
          </div>
          <ProjectTable searchTerm={searchTerm} filterOptions={filterOptions} />
        </div>
      )}
      <Outlet />
    </div>
  );
};
