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
  const { projectData, setProjectData, setValid } = useProjectData();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: projectData?.name || '',
      endDate: projectData?.end_date || '',
      client: projectData?.client || '',
      employees: projectData?.employees || [],
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

  useEffect(() => {
    if (projectData) {
      setValue('name', projectData.name || '');
      setValue('endDate', projectData.end_date || '');
      setValue('client', projectData.client || '');
      setValue('employees', projectData.employees || []);
    }
  }, [projectData, setValue]);

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
              {...register('name', { required: 'Nazwa projektu jest wymagana' })}
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
              {...register('endDate', { required: 'Data zakończenia jest wymagana' })}
            />
            {errors.endDate && <span className={styles.error}>{errors.endDate.message}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Klient
            <input
              className={styles.input}
              type="text"
              {...register('client', { required: 'Klient jest wymagany' })}
            />
            {errors.client && <span className={styles.error}>{errors.client.message}</span>}
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Pracownicy
            <Controller
              name="employees"
              control={control}
              render={({ field }) => (
                <select className={styles.select} {...field} multiple>
                  <option value="Employee 1">Employee 1</option>
                  <option value="Employee 2">Employee 2</option>
                  <option value="Employee 3">Employee 3</option>
                </select>
              )}
            />
            {errors.employees && <span className={styles.error}>{errors.employees.message}</span>}
          </label>
        </div>
      </form>
    </div>
  );
}

export default ProjectDataForm;
