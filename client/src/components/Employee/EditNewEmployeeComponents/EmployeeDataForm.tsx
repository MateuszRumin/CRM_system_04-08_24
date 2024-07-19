import React, { useState, useEffect, useCallback } from 'react';
import styles from './EmployeeDataForm.module.css';

interface Employee {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  position: string;
  role: string;
  contractType: string;
}

interface Position {
  position_id: number;
  name: string;
}

interface Role {
  role_id: number;
  name: string;
}

interface EmployeeDataFormProps {
  employee: Employee;
  positions: Position[];
  roles: Role[];
  onSave: (updatedEmployee: Employee) => void;
  onValidate: (isValid: boolean) => void;
}

export const EmployeeDataForm: React.FC<EmployeeDataFormProps> = ({ employee, positions, roles, onSave, onValidate }) => {
  const [formData, setFormData] = useState<Employee>({
    id: employee.id,
    name: employee.name || '',
    email: employee.email || '',
    phoneNumber: employee.phoneNumber || '',
    address: employee.address || '',
    position: employee.position || '',
    role: employee.role || '',
    contractType: employee.contractType || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = useCallback(() => {
    const isValid =
      (formData.name?.trim() || '') !== '' &&
      (formData.email?.includes('@') || false) &&
      (formData.phoneNumber?.trim() || '') !== '' &&
      (formData.address?.trim() || '') !== '' &&
      (formData.position?.trim() || '') !== '' &&
      (formData.role?.trim() || '') !== '' &&
      (formData.contractType?.trim() || '') !== '';
      
    onValidate(isValid);
  }, [formData, onValidate]);

  useEffect(() => {
    onSave(formData);
    validateForm();
  }, [formData, onSave, validateForm]);

  return (
    <form className={styles['employee-form']}>
      <div className={styles['form-section']}>
        <div className={styles['form-group']}>
          <label htmlFor="name">Imię i nazwisko:</label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="email">Adres e-mail:</label>
          <input id="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
      </div>
      <div className={styles['form-section']}>
        <div className={styles['form-group']}>
          <label htmlFor="contractType">Rodzaj umowy:</label>
          <select id="contractType" name="contractType" value={formData.contractType} onChange={handleChange}>
            <option value="Umowa o pracę">Umowa o pracę</option>
            <option value="Umowa zlecenie">Umowa zlecenie</option>
            <option value="Umowa o dzieło">Umowa o dzieło</option>
          </select>
        </div>
      </div>
      <div className={styles['form-section']}>
        <div className={styles['form-group']}>
          <label htmlFor="phoneNumber">Numer telefonu:</label>
          <input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="address">Adres zamieszkania:</label>
          <input id="address" name="address" value={formData.address} onChange={handleChange} />
        </div>
      </div>
      <div className={styles['form-section']}>
        <div className={styles['form-group']}>
          <label htmlFor="position">Stanowisko:</label>
          <select id="position" name="position" value={formData.position} onChange={handleChange}>
            {positions.map(position => (
              <option key={position.position_id} value={position.name}>
                {position.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="role">Rola:</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            {roles.map(role => (
              <option key={role.role_id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
};

export default EmployeeDataForm;
