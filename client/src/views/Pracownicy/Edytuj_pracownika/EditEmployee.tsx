import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmployeeDataForm from '../../../components/Employee/EditNewEmployeeComponents/EmployeeDataForm';
import styles from './EditEmployee.module.css'
import BlueButton from '../../../components/Buttons/BlueButton';

export function EditEmployee() {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state.employee;

  const [formData, setFormData] = useState(employee);
  const [isValid, setIsValid] = useState(false);

  const handleSave = (updatedEmployee: typeof employee) => {
    // Tutaj będzie dodana logikę aktualizacji danych pracownika w bazie danych lub stanie aplikacji
    console.log('Zaktualizowane dane pracownika:', updatedEmployee);

    // Przekierowanie z powrotem do listy pracowników po zapisaniu
    navigate('/pracownicy');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h1>Edycja pracownika: {employee.name}</h1>
        <p>Walidacja: {isValid ? 'true' : 'false'}</p>
        <BlueButton
          buttonText='Zapisz zmiany'
          buttonStyle={styles.blueButton}
          disabled={!isValid}
          onClickAction={() => handleSave(formData)}
        />
      </div>
      <div className={styles.formContainer}>
        <EmployeeDataForm
          employee={formData}
          onSave={(updatedEmployee) => setFormData(updatedEmployee)}
          onValidate={setIsValid}
        />
      </div>
    </div>
  );
}

export default EditEmployee;
