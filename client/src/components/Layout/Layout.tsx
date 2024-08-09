import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { MainContent } from '../MainContent/MainContent';
import { Sidebar } from '../Sidebar/Sidebar';
import { Topbar } from '../Topbar/Topbar';
import { Outlet } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3000';

interface DecodedToken {
  userId: number;
  role: string;
}

const verifyUserRole = async (userId: number, role: string) => {
  try {
    const response = await axios.get(`${apiServerUrl}/employees/${userId}`);
    const userRole = response.data.UserRole[0].Role.name;
    return userRole === role;
  } catch (error) {
    console.error('Error verifying user role:', error);
    return false;
  }
};

export const Layout = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const { userId, role } = decodedToken;

        const verifyAndSetUser = async () => {
          const isValidRole = await verifyUserRole(userId, role);
          if (!isValidRole) {
            navigate('/login');
            return;
          }

          setUser({ role });
          localStorage.setItem('USER', JSON.stringify({ role, userId }));
          setIsLoading(false);
        };

        verifyAndSetUser();
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('USER');
        setIsLoading(false);
        navigate('/login');
      }
    } else {
      setIsLoading(false);
      navigate('/login');
    }
  }, [navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Sidebar />
      <MainContent>
        <Topbar />
        <Outlet />
      </MainContent>
    </>
  );
};
