import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <div className="brand">Voluntariado IFRS</div>

        <ul className="nav-links">
          <li>
            <NavLink to="/events">Eventos</NavLink>
          </li>

          {!user && (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}

          {user && (
            <>
              <li>
                <NavLink to="/volunteers">Voluntários</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                {user.email} ({user.role})
              </li>
              <li>
                <button className="btn" onClick={logout}>
                  Sair
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
