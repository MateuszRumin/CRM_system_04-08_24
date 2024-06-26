import { useState } from 'react';
import { ClientTable } from '../../components/Client/ClientTable';
import { SearchClient } from '../../components/Client/SearchClient';
import { FilterClient } from '../../components/Client/FilterClient';
import { AddNewClientButton } from '../../components/Client/AddNewClientButton';
import styles from './Klienci.module.css';
import { Outlet, useLocation } from 'react-router-dom';

export const Klienci = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const isAddClientRoute = location.pathname.includes('add-client');
  const isEditClientRoute = location.pathname.includes('edit-client');

  return (
    <div>
      {!isAddClientRoute && !isEditClientRoute && (
        <div className={styles.testowe1}>
          <div className={styles.testowe}>
            <h1>Klienci</h1>
            <div className={styles.actions}>
              <SearchClient onSearch={setSearchTerm} />
              <FilterClient />
              <AddNewClientButton />
            </div>
          </div>
          <ClientTable searchTerm={searchTerm} />
        </div>
      )}
      <Outlet />
    </div>
  );
};
