import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './ProjectDataForm.module.css';
import { useProjectData } from '../../../contexts/ProjectDataContext';

interface ProjectDataFormProps {
  onSubmit: (data: any) => void;
  formId: string;
}

interface FormValues {
  name: string;
  endDate: string;
  client: string;
  employees: string[];
}

export function ProjectDataForm({ onSubmit, formId }: ProjectDataFormProps) {
  const { setProjectData, setValid } = useProjectData();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      employees: [],
    },
  });

  useEffect(() => {
    setProjectData((prevData: any) => ({
      ...prevData,
      ...watch(),
    }));
  }, [watch, setProjectData]);

  useEffect(() => {
    setValid(isValid);
  }, [isValid, setValid]);

  return (
    <div className={styles.formContainer}>
      <h2>Dane projektu</h2>
      <form id={formId} className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <label className={styles.label}>
            Nazwa projektu
            <input
              className={styles.input}
              type="text"
              {...register('name', {
                required: 'Nazwa projektu jest wymagana.',
                minLength: { value: 3, message: 'Nazwa projektu musi mieć co najmniej 3 znaki.' },
              })}
            />
            {errors.name && <span className={styles.error}>{errors.name.message}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Przewidywana data końcowa
            <input
              className={styles.input}
              type="date"
              {...register('endDate', {
                required: 'Przewidywana data końcowa jest wymagana.',
              })}
            />
            {errors.endDate && <span className={styles.error}>{errors.endDate.message}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Klient
            <Controller
              name="client"
              control={control}
              rules={{ required: 'Klient jest wymagany.' }}
              render={({ field }) => (
                <select className={styles.select} {...field}>
                  <option value="">Wybierz klienta</option>
                  <option value="1">Klient A</option>
                  <option value="2">Klient B</option>
                  <option value="3">Klient C</option>
                </select>
              )}
            />
            {errors.client && <span className={styles.error}>{errors.client.message}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Przypisani pracownicy
            <div className={styles.checkboxGroup}>
              {['1', '2', '3'].map(value => (
                <label key={value}>
                  <input
                    type="checkbox"
                    value={value}
                    {...register('employees', {
                      validate: (value: string[]) => value.length > 0 || 'Przypisani pracownicy są wymagani.'
                    })}
                  />
                  Pracownik {value}
                </label>
              ))}
            </div>
            {errors.employees && <span className={styles.error}>{errors.employees.message}</span>}
          </label>
        </div>
        <button type="submit" style={{ display: 'none' }}>Ukryty przycisk</button>
      </form>
    </div>
  );
}
