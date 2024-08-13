import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { ButtonTopBar } from '../ButtonTopBar/ButtonTopBar';
import logOut from '../../assets/TopBarIcons/log-out.svg';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

export const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogout = async () => {
    // try {
    //   const response = await fetch(`${apiServerUrl}/employees/logout`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${localStorage.getItem('token')}`, // Dodaj token do nagłówka
    //     },
    //   });

    //   if (!response.ok) {
    //     throw new Error('Logout failed');
    //   }

      // Usuń dane z localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('USER');

      localStorage.setItem('nazwa','wsfow9i');

      // Zaktualizuj kontekst użytkownika
      setUser(null);
      navigate('/login');
    // } catch (error: any) {
    //   console.error('Error during logout:', error);
    // }
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
