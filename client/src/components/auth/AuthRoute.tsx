import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

interface AuthRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || (allowedRoles.length > 0 && !allowedRoles.includes(user?.role || ''))) {
      navigate('/login');
    }
  }, [navigate, user, allowedRoles]);

  if (allowedRoles.length === 0 || allowedRoles.includes(user?.role || '')) {
    return <>{children}</>;
  } else {
    navigate('/login');
    return null;
  }
};
