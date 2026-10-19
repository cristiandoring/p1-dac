import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { http } from '../api/http';

const AuthContext = createContext(null);

function lerUsuarioSalvo() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // A sessão é restaurada já na criação do estado
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(lerUsuarioSalvo);

  const login = useCallback(async ({ email, senha }) => {
    const { data } = await http.post('/auth/login', { email, senha });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ token, user, login, logout }), [token, user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
