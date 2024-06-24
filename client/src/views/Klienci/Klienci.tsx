import { ClientTable } from '../../components/Client/ClientTable';
import { SearchClient } from '../../components/Client/SearchClient';
import { FilterClient } from '../../components/Client/FilterClient';
import { AddNewClient } from '../../components/Client/AddNewClient'
import styles from './Klienci.module.css'

export const Klienci = () => {
  return (
    <div>
      <div className={styles.testowe1}>
      <div className={styles.testowe}>
        <h1>Klienci</h1>
        <div className={styles.actions}>
          <SearchClient />
          <FilterClient />
          <AddNewClient />
        </div>
      </div>
      <ClientTable />
    </div>
    </div>
    
  );
};