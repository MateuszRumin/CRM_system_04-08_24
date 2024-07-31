import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './ProjectDataForm.module.css';
import { useProjectData } from '../../../contexts/ProjectDataContext';

interface ProjectDataFormProps {
  onSubmit: (data: any) => void;
  formId: string;
  employees: any[];
  statuses: any[];
  clients: any[];
}

interface FormValues {
  name: string;
  endDate: string;
  client: string;
  status: string;
  cost: number;
  description: string;
  employees: string[];
}

export function ProjectDataForm({ onSubmit, formId, employees, statuses, clients }: ProjectDataFormProps) {
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
            Data zakończenia
            <input
              className={styles.input}
              type="date"
              {...register('endDate', {
                required: 'Data zakończenia jest wymagana.',
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
                  {clients.map((client) => (
                    <option key={client.client_id} value={client.client_id}>
                      {client.company_name
                        ? `${client.first_name} ${client.second_name} - ${client.company_name}`
                        : `${client.first_name} ${client.second_name}`}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.client && <span className={styles.error}>{errors.client.message}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Status projektu
            <Controller
              name="status"
              control={control}
              rules={{ required: 'Status projektu jest wymagany.' }}
              render={({ field }) => (
                <select className={styles.select} {...field}>
                  <option value="">Wybierz status</option>
                  {statuses.map((status) => (
                    <option key={status.status_id} value={status.status_id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.status && <span className={styles.error}>{errors.status.message}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Koszt
            <input
              className={styles.input}
              type="number"
              step="0.01"
              {...register('cost', {
                required: 'Koszt jest wymagany.',
                min: { value: 0, message: 'Koszt musi być większy lub równy 0.' },
              })}
            />
            {errors.cost && <span className={styles.error}>{errors.cost.message}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Opis projektu
            <textarea
              className={styles.textarea}
              {...register('description')}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Przypisani pracownicy
            <div className={styles.checkboxGroup}>
              {employees.map((employee) => (
                <label key={employee.user_id}>
                  <input
                    type="checkbox"
                    value={employee.user_id}
                    {...register('employees', {
                      validate: (value: string[]) => value.length > 0 || 'Przypisani pracownicy są wymagani.'
                    })}
                  />
                  {employee.first_name} {employee.second_name}
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
