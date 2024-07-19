import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmployeeDataForm from '../../../components/Employee/EditNewEmployeeComponents/EmployeeDataForm';
import styles from './EditEmployee.module.css';
import BlueButton from '../../../components/Buttons/BlueButton';

interface Position {
  position_id: number;
  name: string;
}

interface Role {
  role_id: number;
  name: string;
}

export function EditEmployee() {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state.employee;

  const [formData, setFormData] = useState(employee);
  const [isValid, setIsValid] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchPositionsAndRoles = async () => {
      try {
        const [positionsResponse, rolesResponse] = await Promise.all([
          axios.get('http://localhost:3000/employees/position'),
          axios.get('http://localhost:3000/permissions/role')
        ]);
        setPositions(positionsResponse.data);
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error('Error fetching positions and roles:', error);
      }
    };

    fetchPositionsAndRoles();
  }, []);

  const handleSave = (updatedEmployee: typeof employee) => {
    const position: Position | undefined = positions.find(pos => pos.name === updatedEmployee.position);
    const role: Role | undefined = roles.find(rol => rol.name === updatedEmployee.role);
  
    const payload = {
      username: updatedEmployee.name.split(' ')[0],
      email: updatedEmployee.email,
      password: "new_password",
      userData: {
        first_name: updatedEmployee.name.split(' ')[0],
        second_name: updatedEmployee.name.split(' ')[1] || '',
        employed_from: "2024-01-01T00:00:00.000Z",
        employed_to: "2025-01-01T00:00:00.000Z",
        tel_number: updatedEmployee.phoneNumber,
        address: updatedEmployee.address,
        contract: updatedEmployee.contractType,
        position_id: position?.position_id || 0
      },
      userRoles: [
        { role_id: role?.role_id || 0 }
      ]
    };
  
    axios.put(`http://localhost:3000/employees/${updatedEmployee.id}`, payload)
      .then(response => {
        console.log('Zaktualizowano dane pracownika:', response.data);
        navigate('/pracownicy');
      })
      .catch(error => {
        console.error('Błąd aktualizacji danych pracownika:', error);
      });
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
          positions={positions}
          roles={roles}
          onSave={(updatedEmployee) => setFormData(updatedEmployee)}
          onValidate={setIsValid}
        />
      </div>
    </div>
  );
}

export default EditEmployee;
