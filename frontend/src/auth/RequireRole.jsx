import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RequireRole({ role, children }) {
  const { user } = useAuth();

  // Logado, mas sem o papel exigido: vai para a página de acesso negado
  if (!user || user.role !== role) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
