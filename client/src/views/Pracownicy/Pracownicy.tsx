import { useState } from 'react';
import { EmployeeTable } from '../../components/Employee/EmployeeTable';
import { SearchEmployee } from '../../components/Employee/SearchEmployee';
import { FilterEmployee } from '../../components/Employee/FilterEmployee';
import { AddNewEmployeeButton } from '../../components/Employee/AddNewEmployeeButton';
import styles from './Pracownicy.module.css';
import { Outlet, useLocation } from 'react-router-dom';

export const Pracownicy = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>({});

  const isAddEmployeeRoute = location.pathname.includes('add-employee');
  const isEditEmployeeRoute = location.pathname.includes('edit-employee');
  const isDetailsEmployeeRoute = location.pathname.includes('details-employee');

  const shouldShowEmployeeList = !isAddEmployeeRoute && !isEditEmployeeRoute && !isDetailsEmployeeRoute;

  return (
    <div>
      {shouldShowEmployeeList && (
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Pracownicy</h1>
            <div className={styles.actions}>
              <SearchEmployee onSearch={setSearchTerm} />
              <FilterEmployee onFilter={setFilterOptions} />
              <AddNewEmployeeButton />
            </div>
          </div>
          <EmployeeTable searchTerm={searchTerm} filterOptions={filterOptions} />
        </div>
      )}
      <Outlet />
    </div>
  );
};
