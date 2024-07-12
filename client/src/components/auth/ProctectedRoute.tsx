
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/" /> : element;
};

export default ProtectedRoute;
