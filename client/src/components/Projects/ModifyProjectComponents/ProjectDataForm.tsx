import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './ProjectDataForm.module.css';
import { useProjectData } from '../../../contexts/ProjectDataContext';

interface ProjectDataFormProps {
  onSubmit: (data: any) => void;
  formId: string;
  statuses: any[];
  employees: any[];
  initialValues: any;
}

interface FormValues {
  name: string;
  status_id: number;
  description: string;
  cost: number;
  deadline: string;
  assignedUsers: number[];
}

export function ProjectDataForm({ onSubmit, formId, statuses, employees, initialValues }: ProjectDataFormProps) {
  const { setProjectData, setValid } = useProjectData();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: initialValues?.name || '',
      status_id: initialValues?.Status?.status_id ? parseInt(initialValues.Status.status_id, 10) : 0,
      description: initialValues?.description || '',
      cost: initialValues?.ProjectDetail[0]?.cost || 0,
      deadline: initialValues?.ProjectDetail[0]?.deadline.split('T')[0] || '',
      assignedUsers: initialValues?.ProjectAssignment.map((assignment: any) => assignment.User.UserData[0]?.user_id) || [],
    },
  });

  useEffect(() => {
    setProjectData((prevData: any) => ({
      ...prevData,
      ...initialValues,
    }));
  }, [initialValues, setProjectData]);

  useEffect(() => {
    setValid(isValid);
  }, [isValid, setValid]);

  // Handle checkbox changes
  const handleCheckboxChange = (userId: number, checked: boolean) => {
    // Retrieve the current value of assignedUsers
    const currentAssignedUsers = getValues('assignedUsers') || [];

    if (!Array.isArray(currentAssignedUsers)) {
      console.error('assignedUsers should be an array');
      return;
    }

    if (checked) {
      // Add userId if it's not already in the array
      if (!currentAssignedUsers.includes(userId)) {
        setValue('assignedUsers', [...currentAssignedUsers, userId]);
      }
    } else {
      // Remove userId if it's in the array
      setValue('assignedUsers', currentAssignedUsers.filter((id: number) => id !== userId));
    }
  };

  // Sync checkboxes state with form values
  useEffect(() => {
    const assignedUsers = getValues('assignedUsers') || [];
    employees.forEach(employee => {
      // Ensure that each employee's checkbox reflects the current state
      const isChecked = assignedUsers.includes(employee.user_id);
      document.getElementById(`employee-${employee.user_id}`)!.checked = isChecked;
    });
  }, [getValues('assignedUsers'), employees]);

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
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Status
            <Controller
              name="status_id"
              control={control}
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
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Opis
            <input
              className={styles.input}
              type="text"
              {...register('description', { required: 'Opis jest wymagany' })}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Koszt
            <input
              className={styles.input}
              type="number"
              {...register('cost', { required: 'Koszt jest wymagany' })}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Termin
            <input
              className={styles.input}
              type="date"
              {...register('deadline', { required: 'Termin jest wymagany' })}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>
            Pracownicy
            <div className={styles.checkboxContainer}>
              {employees.map((employee) => (
                <div className={styles.checkboxRow} key={employee.user_id}>
                  <input
                    type="checkbox"
                    id={`employee-${employee.user_id}`}
                    onChange={(e) => handleCheckboxChange(employee.user_id, e.target.checked)}
                  />
                  <label className={styles.checkboxLabel} htmlFor={`employee-${employee.user_id}`}>
                    {employee.UserData[0]?.first_name} {employee.UserData[0]?.second_name}
                  </label>
                </div>
              ))}
            </div>
          </label>
        </div>
        <button type="submit" style={{ display: 'none' }}></button> {/* Ukryty przycisk do wymuszenia submit */}
      </form>
    </div>
  );
}

export default ProjectDataForm;
