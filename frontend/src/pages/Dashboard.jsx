import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http';
import { formatarDataHora } from '../utils/datas';

export default function Dashboard() {
  const [painel, setPainel] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    http
      .get('/dashboard')
      .then(({ data }) => setPainel(data))
      .catch(() => setErro('Erro ao carregar o painel.'));
  }, []);

  if (erro) {
    return <p className="alert">{erro}</p>;
  }
  if (!painel) {
    return <p>Carregando...</p>;
  }

  const { resumo, eventos } = painel;

  return (
    <section className="card">
      <h1>Dashboard</h1>
      <p>
        {painel.mensagem} Perfil: <strong>{painel.usuario.role}</strong>
      </p>

      <div className="estatisticas">
        <div className="estatistica">
          <span className="estatistica-valor">{resumo.total_eventos}</span>
          <span className="estatistica-rotulo">Eventos</span>
        </div>
        <div className="estatistica">
          <span className="estatistica-valor">{resumo.total_voluntarios}</span>
          <span className="estatistica-rotulo">Voluntários</span>
        </div>
        <div className="estatistica">
          <span className="estatistica-valor">{resumo.total_inscricoes}</span>
          <span className="estatistica-rotulo">Inscrições</span>
        </div>
      </div>

      <div className="secao">
        <h2>Inscrições por evento</h2>

        {eventos.length === 0 && <p className="vazio">Nenhum evento cadastrado.</p>}

        <div className="eventos-resumo">
          {eventos.map((evento) => {
            const lotado = evento.total_inscritos >= evento.max_voluntarios;

            return (
              <article key={evento.id} className="evento-resumo">
                <h3>
                  <Link to={`/events/${evento.id}`}>{evento.titulo}</Link>
                </h3>
                <p className="evento-resumo-data">{formatarDataHora(evento.data_evento)}</p>

                <span className={lotado ? 'etiqueta etiqueta--lotado' : 'etiqueta'}>
                  {evento.total_inscritos} de {evento.max_voluntarios} vagas
                  {lotado && ' · Lotado'}
                </span>

                {evento.inscritos.length === 0 ? (
                  <p className="vazio">Nenhum voluntário inscrito.</p>
                ) : (
                  <ul className="chips">
                    {evento.inscritos.map((inscrito) => (
                      <li key={inscrito.id} className="chip">
                        {inscrito.nome}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
