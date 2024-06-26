import styles from './AddNewClient.module.css';
import { ClientDataForm } from '../../../components/Client/AddNewClientComponents/ClientDataForm';
import { ClientNotes } from '../../../components/Client/AddNewClientComponents/ClientNotes';
import { ClientTasks } from '../../../components/Client/AddNewClientComponents/ClientTasks';
import BlueButton from '../../../components/Buttons/BlueButton';
import { DataProvider } from '../../../contexts/DataContext';

export function AddNewClient() {
  return (
    <DataProvider>
      <div className={styles.pageContainer}>
        <div className={styles.headerContainer}>
          <h1>Dodaj nowego klienta</h1>
          <BlueButton
            buttonStyle={styles.sdsds}
            buttonText="Zapisz nowego klienta"
            redirectPath="/klienci" // Przekierowanie do /klienci po zapisaniu nowego klienta
          />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.row}>
            <ClientDataForm />
            <ClientNotes />
          </div>
          <ClientTasks />
        </div>
      </div>
    </DataProvider>
  );
}
