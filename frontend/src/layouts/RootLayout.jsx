import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-inner">© {new Date().getFullYear()} Campanhas de voluntariado</div>
      </footer>
    </>
  );
}
