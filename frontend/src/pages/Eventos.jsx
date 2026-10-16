import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http';
import { useAuth } from '../auth/AuthContext';
import Button from '../components/Button';
import { formatarDataHora } from '../utils/datas';

export default function Eventos() {
  const { user } = useAuth();
  const ehAdmin = user?.role === 'admin';

  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    http
      .get('/events')
      .then(({ data }) => setEventos(data))
      .catch(() => setErro('Não foi possível carregar os eventos.'))
      .finally(() => setCarregando(false));
  }, []);

  async function excluir(evento) {
    if (!window.confirm(`Excluir o evento "${evento.titulo}"?`)) {
      return;
    }
    try {
      await http.delete(`/events/${evento.id}`);
      setEventos((atuais) => atuais.filter((item) => item.id !== evento.id));
    } catch (falha) {
      setErro(falha.response?.data?.error ?? 'Não foi possível excluir o evento.');
    }
  }

  return (
    <section className="card">
      <div className="cabecalho-pagina">
        <h1>Eventos</h1>
        {ehAdmin && (
          <Link className="btn" to="/events/new">
            Novo evento
          </Link>
        )}
      </div>

      {erro && <p className="alert">{erro}</p>}
      {carregando && <p>Carregando...</p>}
      {!carregando && eventos.length === 0 && <p>Nenhum evento cadastrado.</p>}

      {eventos.length > 0 && (
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Título</th>
                <th>Local</th>
                <th>Data</th>
                <th>Limite</th>
                {user && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id}>
                  <td>{evento.titulo}</td>
                  <td>{evento.localizacao}</td>
                  <td>{formatarDataHora(evento.data_evento)}</td>
                  <td>{evento.max_voluntarios}</td>
                  {user && (
                    <td className="acoes">
                      <Link className="btn" to={`/events/${evento.id}`}>
                        Inscritos
                      </Link>
                      {ehAdmin && (
                        <>
                          <Link className="btn" to={`/events/${evento.id}/edit`}>
                            Editar
                          </Link>
                          <Button variante="perigo" onClick={() => excluir(evento)}>
                            Excluir
                          </Button>
                        </>
                      )}
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
