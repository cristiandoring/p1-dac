import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RequireAuth({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  // Sem token: vai para o login e guarda a página que o usuário queria ver
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
