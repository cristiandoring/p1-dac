import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http';
import { useAuth } from '../auth/AuthContext';
import Button from '../components/Button';
import { mascararTelefone } from '../utils/mascaras';

export default function Voluntarios() {
  const { user } = useAuth();
  const ehAdmin = user?.role === 'admin';

  const [voluntarios, setVoluntarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    http
      .get('/volunteers')
      .then(({ data }) => setVoluntarios(data))
      .catch(() => setErro('Não foi possível carregar os voluntários.'))
      .finally(() => setCarregando(false));
  }, []);

  async function excluir(voluntario) {
    if (!window.confirm(`Excluir o voluntário "${voluntario.nome}"?`)) {
      return;
    }
    try {
      await http.delete(`/volunteers/${voluntario.id}`);
      setVoluntarios((atuais) => atuais.filter((item) => item.id !== voluntario.id));
    } catch (falha) {
      setErro(falha.response?.data?.error ?? 'Não foi possível excluir o voluntário.');
    }
  }

  return (
    <section className="card">
      <div className="cabecalho-pagina">
        <h1>Voluntários</h1>
        {ehAdmin && (
          <Link className="btn" to="/volunteers/new">
            Novo voluntário
          </Link>
        )}
      </div>

      {erro && <p className="alert">{erro}</p>}
      {carregando && <p>Carregando...</p>}
      {!carregando && voluntarios.length === 0 && <p>Nenhum voluntário cadastrado.</p>}

      {voluntarios.length > 0 && (
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                {ehAdmin && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {voluntarios.map((voluntario) => (
                <tr key={voluntario.id}>
                  <td>{voluntario.nome}</td>
                  <td>{voluntario.email}</td>
                  <td>{voluntario.telefone ? mascararTelefone(voluntario.telefone) : '—'}</td>
                  
                  {ehAdmin && (
                    <td className="acoes">
                      <Link className="btn" to={`/volunteers/${voluntario.id}/edit`}>
                        Editar
                      </Link>
                      <Button variante="perigo" onClick={() => excluir(voluntario)}>
                        Excluir
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
