import styles from './AddNewEmployee.module.css';
import { EmployeeDataForm } from '../../../components/Employee/AddNewEmployeeComponents/EmployeeDataForm';
import BlueButton from '../../../components/Buttons/BlueButton';
import { useData } from '../../../contexts/DataContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

export function AddNewEmployee() {
  const { isValid } = useData();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    const position = await axios.get(`${apiServerUrl}/employees/position`);
    const role = await axios.get(`${apiServerUrl}/permissions/role`);

    const selectedPosition = position.data.find((pos: any) => pos.name === data.position);
    const selectedRole = role.data.find((rol: any) => rol.name === data.role);

    const formatToISO8601 = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString();
    };

    const payload = {
      email: data.email,
      userData: {
        first_name: data.firstName,
        second_name: data.lastName,
        employed_from: formatToISO8601(data.startDate),
        tel_number: data.phone,
        address: data.address,
        contract: data.contractType,
        position_id: selectedPosition ? selectedPosition.position_id : 0,
      },
      userRoles: [
        { role_id: selectedRole ? selectedRole.role_id : 0 }
      ],
      username: data.username,  // Dodaj username do payloadu
    };

    axios.post(`${apiServerUrl}/employees/register`, payload)
      .then(response => {
        console.log('Dodano nowego pracownika:', response.data);
        navigate('/pracownicy');
      })
      .catch(error => {
        console.error('Błąd podczas dodawania pracownika:', error);
      });
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

export default AddNewEmployee;
