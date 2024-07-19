import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './EmployeeDataForm.module.css';
import { useData } from '../../../contexts/DataContext';
import axios from 'axios';

interface EmployeeDataFormProps {
  onSubmit: (data: any) => void;
  formId: string;
}

interface EmployeeData {
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  startDate: string;
  contractType: string;
  role: string;
}

export function EmployeeDataForm({ onSubmit, formId }: EmployeeDataFormProps) {
  const { setEmployeeData, setValid, employeeData } = useData();
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<EmployeeData>({
    mode: 'onChange',
    defaultValues: employeeData,
  });

  useEffect(() => {
    setEmployeeData((prevData: EmployeeData) => ({
      ...prevData,
      ...watch(),
    }));
  }, [watch, setEmployeeData]);

  useEffect(() => {
    setValid(isValid);
  }, [isValid, setValid]);

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

  return (
    <div className={styles.formContainer}>
      <h2>Dane pracownika</h2>
      <form id={formId} className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <label className={styles.label}>
            Imię
            <input
              className={styles.input}
              type="text"
              {...register('firstName', {
                required: 'Imię jest wymagane.',
                minLength: { value: 2, message: 'Imię musi mieć co najmniej 2 znaki.' },
                pattern: {
                  value: /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
                  message: 'Imię może zawierać tylko litery i spacje.',
                },
              })}
            />
            {errors.firstName && <span className={styles.error}>{errors.firstName.message as string}</span>}
          </label>
          <label className={styles.label}>
            Nazwisko
            <input
              className={styles.input}
              type="text"
              {...register('lastName', {
                required: 'Nazwisko jest wymagane.',
                minLength: { value: 2, message: 'Nazwisko musi mieć co najmniej 2 znaki.' },
                pattern: {
                  value: /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
                  message: 'Nazwisko może zawierać tylko litery i spacje.',
                },
              })}
            />
            {errors.lastName && <span className={styles.error}>{errors.lastName.message as string}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Stanowisko
            <select
              className={styles.select}
              {...register('position', { required: 'Stanowisko jest wymagane.' })}
            >
              {positions.map((position: any) => (
                <option key={position.position_id} value={position.name}>
                  {position.name}
                </option>
              ))}
            </select>
            {errors.position && <span className={styles.error}>{errors.position.message as string}</span>}
          </label>
          <label className={styles.label}>
            Rodzaj umowy
            <select
              className={styles.select}
              {...register('contractType', { required: 'Rodzaj umowy jest wymagany.' })}
            >
              <option value="Umowa o pracę">Umowa o pracę</option>
              <option value="Umowa zlecenie">Umowa zlecenie</option>
              <option value="Umowa o dzieło">Umowa o dzieło</option>
            </select>
            {errors.contractType && <span className={styles.error}>{errors.contractType.message as string}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Adres e-mail
            <input
              className={styles.input}
              type="email"
              {...register('email', {
                required: 'Adres e-mail jest wymagany.',
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: 'Nieprawidłowy format e-mail.',
                },
              })}
            />
            {errors.email && <span className={styles.error}>{errors.email.message as string}</span>}
          </label>
          <label className={styles.label}>
            Numer telefonu
            <input
              className={styles.input}
              type="tel"
              {...register('phone', {
                required: 'Numer telefonu jest wymagany.',
                pattern: { value: /^[0-9]+$/, message: 'Numer telefonu może zawierać tylko cyfry.' },
              })}
            />
            {errors.phone && <span className={styles.error}>{errors.phone.message as string}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Adres zamieszkania
            <input
              className={styles.input}
              type="text"
              {...register('address', {
                required: 'Adres zamieszkania jest wymagany.',
                minLength: { value: 3, message: 'Adres musi mieć co najmniej 3 znaki.' },
              })}
            />
            {errors.address && <span className={styles.error}>{errors.address.message as string}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Data rozpoczęcia pracy
            <input
              className={styles.input}
              type="date"
              {...register('startDate', {
                required: 'Data rozpoczęcia pracy jest wymagana.',
              })}
            />
            {errors.startDate && <span className={styles.error}>{errors.startDate.message as string}</span>}
          </label>
          <label className={styles.label}>
            Rola
            <select
              className={styles.select}
              {...register('role', { required: 'Rola jest wymagana.' })}
            >
              {roles.map((role: any) => (
                <option key={role.role_id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role && <span className={styles.error}>{errors.role.message as string}</span>}
          </label>
        </div>
        <button type="submit" style={{ display: 'none' }}>Ukryty przycisk</button>
      </form>
    </div>
  );
}

export default EmployeeDataForm;
