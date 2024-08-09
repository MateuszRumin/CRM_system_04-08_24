import React, { useState, useEffect } from 'react';
import { ClientTable } from '../../components/Client/ClientTable';
import { SearchClient } from '../../components/Client/SearchClient';
import { FilterClient } from '../../components/Client/FilterClient';
import { AddNewClientButton } from '../../components/Client/AddNewClientButton';
import styles from './Klienci.module.css';
import { Outlet, useLocation } from 'react-router-dom';

export const Klienci = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>({});
  const [refresh, setRefresh] = useState<boolean>(false); // Dodaj stan do zarządzania odświeżaniem

  const isAddClientRoute = location.pathname.includes('add-client');
  const isEditClientRoute = location.pathname.includes('edit-client');
  const isDetailClientRoute = location.pathname.includes('details-client');

  useEffect(() => {
    if (!isAddClientRoute && !isEditClientRoute && !isDetailClientRoute) {
      setRefresh(prev => !prev); // Przełącz stan odświeżania
    }
  }, [location.pathname]);

  return (
    <div>
      {!isAddClientRoute && !isEditClientRoute && !isDetailClientRoute && (
        <div className={styles.testowe1}>
          <div className={styles.testowe}>
            <h1>Klienci</h1>
            <div className={styles.actions}>
              <SearchClient onSearch={setSearchTerm} />
              <FilterClient onFilter={setFilterOptions} />
              <AddNewClientButton />
            </div>
          </div>
          <ClientTable 
            searchTerm={searchTerm} 
            filterOptions={filterOptions} 
            refresh={refresh} // Przekaż stan odświeżania
          />
        </div>
      )}
      <Outlet />
    </div>
  );
};
