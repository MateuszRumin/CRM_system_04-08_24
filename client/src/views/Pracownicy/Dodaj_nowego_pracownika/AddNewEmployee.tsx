import styles from './AddNewEmployee.module.css';
import { EmployeeDataForm } from '../../../components/Employee/AddNewEmployeeComponents/EmployeeDataForm';
import BlueButton from '../../../components/Buttons/BlueButton';
import { useData } from '../../../contexts/DataContext';

export function AddNewEmployee() {
  const { isValid } = useData();

  const handleSubmit = (data: any) => {
    console.log('Submitted data:', data); 
    // Tutaj będzie wykorzystanie endpointu do dodania do bazy danych 
  };

  const handleButtonClick = () => {
    const form = document.getElementById('employeeDataFormId') as HTMLFormElement;
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.AddNewEmployeeText}>Dodaj pracownika</h1>
        <p>Walidacja: {isValid ? 'true' : 'false'}</p>
        <BlueButton
          className={`${styles.saveButton} ${!isValid ? styles.disabled : ''}`}
          disabled={!isValid}
          buttonText="Zapisz nowego pracownika"
          onClickAction={handleButtonClick}
        />
      </div>
      <div className={styles.formContainer}>
        <EmployeeDataForm onSubmit={handleSubmit} formId="employeeDataFormId" />
      </div>
    </div>
  );
}