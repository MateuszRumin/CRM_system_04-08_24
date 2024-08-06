import styles from './Login.module.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [submitErrors, setSubmitErrors] = useState<string>('');

  const { setUser } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async (data: Object): Promise<void> => {
    setSubmitErrors('');
    try {
      const response = await fetch('http://localhost:3000/employees/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('1');
      }
      const result = await response.json();
  
      const token = result.token;
      const userData = result.user;

      console.log('Login response:', result); // Debugging statement

      localStorage.setItem('token', token);
      setUser(userData);
  
      reset();
      navigate('/');
    } catch (error: any) {
      if (error.message === '1') {
        setSubmitErrors(() => 'Nieprawidłowy login lub hasło');
      } else {
        setSubmitErrors('Wystąpił błąd połączenia');
      }
    }
  };
  
  return (
    <section className={styles.loginContainer}>
      <div className={styles.login}>
        <h1>{isRegister ? 'Zarejestruj się' : 'Zaloguj się'}</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label htmlFor="username">Nazwa użytkownika</label>
          <input
            type="text"
            id="username"
            {...register('username', {
              required: { value: true, message: 'Podaj username' },
            })}
          />
          {errors.username && <span className={styles.error}>{`${errors.username.message}`}</span>}

          <label htmlFor="password">Hasło</label>
          <input
            type="password"
            id="password"
            {...register('password', { required: 'Podaj hasło' })}
          />
          {errors.password && <span className={styles.error}>{`${errors.password.message}`}</span>}
          {submitErrors && <span className={styles.error}>{submitErrors}</span>}

          <section className={styles.buttonForm}>
            <button type="submit">{isRegister ? 'Zarejestruj' : 'Zaloguj'}</button>
            <span
              onClick={() => {
                clearErrors();
                setIsRegister(prev => !prev);
              }}>
              {isRegister ? 'Zaloguj' : 'Rejestracja'}
            </span>
          </section>
        </form>
      </div>
    </section>
  );
};
