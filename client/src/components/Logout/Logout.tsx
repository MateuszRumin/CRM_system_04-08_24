import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { ButtonTopBar } from '../ButtonTopBar/ButtonTopBar';
import logOut from '../../assets/TopBarIcons/log-out.svg';

export const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogout = () => {
    console.log('Handling logout...');
    
    // Usuń dane z localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('USER');

    console.log('Removed token and USER from localStorage');

    // Zaktualizuj kontekst użytkownika
    setUser(null);
    console.log('User context set to null');

    // Przekieruj na stronę logowania
    navigate('/login');
    console.log('Redirected to /login');
  };

  return (
    <ButtonTopBar
      path="/login"
      src={logOut}
      alt="ikona wylogowania"
      onClick={handleLogout}
    />
  );
};
