import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './auth/AuthContext';
import RequireAuth from './auth/RequireAuth';
import RequireRole from './auth/RequireRole';
import RootLayout from './layouts/RootLayout';

import Dashboard from './pages/Dashboard';
import EventoDetalhe from './pages/EventoDetalhe';
import EventoForm from './pages/EventoForm';
import Eventos from './pages/Eventos';
import Forbidden from './pages/Forbidden';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import VoluntarioForm from './pages/VoluntarioForm';
import Voluntarios from './pages/Voluntarios';

function ApenasAdmin({ children }) {
  return (
    <RequireAuth>
      <RequireRole role="admin">{children}</RequireRole>
    </RequireAuth>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/events" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'forbidden', element: <Forbidden /> },

      // eventos
      { path: 'events', element: <Eventos /> },
      {
        path: 'events/new',
        element: (
          <ApenasAdmin>
            <EventoForm />
          </ApenasAdmin>
        ),
      },
      {
        path: 'events/:id',
        element: (
          <RequireAuth>
            <EventoDetalhe />
          </RequireAuth>
        ),
      },
      {
        path: 'events/:id/edit',
        element: (
          <ApenasAdmin>
            <EventoForm />
          </ApenasAdmin>
        ),
      },

      // voluntários
      {
        path: 'volunteers',
        element: (
          <RequireAuth>
            <Voluntarios />
          </RequireAuth>
        ),
      },
      {
        path: 'volunteers/new',
        element: (
          <ApenasAdmin>
            <VoluntarioForm />
          </ApenasAdmin>
        ),
      },
      {
        path: 'volunteers/:id/edit',
        element: (
          <ApenasAdmin>
            <VoluntarioForm />
          </ApenasAdmin>
        ),
      },

      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
