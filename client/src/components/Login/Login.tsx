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

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/employees/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Dodaj token do nagłówka
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Usuń dane z localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('USER');

      // Zaktualizuj kontekst użytkownika
      setUser(null);
      navigate('/login');
    } catch (error: any) {
      console.error('Error during logout:', error);
    }
  };
  
  // const AUTO_LOGOUT_TIME = 10 * 1000; // 10 sekund, zmień na 8 godzin w produkcji
  const AUTO_LOGOUT_TIME = 8 * 60 * 60 * 1000; // 8 godzin w milisekundach

  const startAutoLogoutTimer = () => {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const expirationTime = new Date(new Date(loginTime).getTime() + AUTO_LOGOUT_TIME).getTime();
      const currentTime = new Date().getTime();
      const timeLeft = expirationTime - currentTime;

      if (timeLeft > 0) {
        setTimeout(() => {
          handleLogout();
        }, timeLeft);
      }
    }
  };

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
      localStorage.setItem('loginTime', new Date().toISOString());
      setUser(userData);
      // await checkSession(); // Ensure session is active

      reset();
      navigate('/');

      startAutoLogoutTimer(); // Uruchom timer wylogowywania

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