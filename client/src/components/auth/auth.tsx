import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

interface AuthRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

interface DecodedToken {
  userId: number;
  role: string;
}

const verifyUserRole = async (userId: number, role: string) => {
  try {
    const response = await axios.get(`http://localhost:3000/employees/${userId}`);
    const userRole = response.data.UserRole[0].Role.name;
    return userRole === role;
  } catch (error) {
    console.error('Error verifying user role:', error);
    return false;
  }
};

export const AuthRoute: React.FC<AuthRouteProps> = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const decodedToken = jwtDecode<DecodedToken>(token);
    const { userId, role } = decodedToken;

    const verifyAndSetUser = async () => {
      const isValidRole = await verifyUserRole(userId, role);
      if (!isValidRole) {
        navigate('/login');
        return;
      }

      setUser({ role });
      setIsLoading(false);
    };

    verifyAndSetUser();
  }, [navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return allowedRoles.length === 0 || allowedRoles.includes(user?.role) ? children : null;
};
