import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { http } from '../api/http';
import { useAuth } from '../auth/AuthContext';
import Button from '../components/Button';
import FormSelect from '../components/FormSelect';
import { formatarDataHora } from '../utils/datas';
import { mascararTelefone } from '../utils/mascaras';

export default function EventoDetalhe() {
  const { id } = useParams();
  const { user } = useAuth();
  const ehAdmin = user?.role === 'admin';

  const [evento, setEvento] = useState(null);
  const [inscritos, setInscritos] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [voluntarioId, setVoluntarioId] = useState('');
  const [erroSelecao, setErroSelecao] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const requisicoes = [http.get(`/events/${id}`), http.get(`/events/${id}/volunteers`)];
    if (ehAdmin) {
      requisicoes.push(http.get('/volunteers'));
    }

    Promise.all(requisicoes)
      .then(([respostaEvento, respostaInscritos, respostaVoluntarios]) => {
        setEvento(respostaEvento.data);
        setInscritos(respostaInscritos.data);
        setVoluntarios(respostaVoluntarios?.data ?? []);
      })
      .catch((falha) =>
        setErro(falha.response?.data?.error ?? 'Não foi possível carregar o evento.'),
      )
      .finally(() => setCarregando(false));
  }, [id, ehAdmin]);

  async function recarregarInscritos() {
    const { data } = await http.get(`/events/${id}/volunteers`);
    setInscritos(data);
  }

  function selecionarVoluntario(mudanca) {
    setVoluntarioId(mudanca.target.value);
    setErroSelecao('');
  }

  async function inscrever(submissao) {
    submissao.preventDefault();
    setErro('');

    if (!voluntarioId) {
      setErroSelecao('Selecione um voluntário para inscrever.');
      document.getElementById('voluntario_id')?.focus();
      return;
    }

    try {
      await http.post(`/events/${id}/volunteers`, { voluntario_id: Number(voluntarioId) });
      setVoluntarioId('');
      await recarregarInscritos();
    } catch (falha) {
      setErro(falha.response?.data?.error ?? 'Não foi possível inscrever o voluntário.');
    }
  }

  async function cancelar(voluntario) {
    if (!window.confirm(`Cancelar a inscrição de ${voluntario.nome}?`)) {
      return;
    }
    setErro('');
    try {
      await http.delete(`/events/${id}/volunteers/${voluntario.id}`);
      setInscritos((atuais) => atuais.filter((item) => item.id !== voluntario.id));
    } catch (falha) {
      setErro(falha.response?.data?.error ?? 'Não foi possível cancelar a inscrição.');
    }
  }

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (!evento) {
    return (
      <section className="card">
        <p className="alert">{erro || 'Evento não encontrado.'}</p>
        <Link to="/events">Voltar para os eventos</Link>
      </section>
    );
  }

  const vagasRestantes = evento.max_voluntarios - inscritos.length;
  const disponiveis = voluntarios.filter(
    (voluntario) => !inscritos.some((inscrito) => inscrito.id === voluntario.id),
  );

  return (
    <section className="card">
      <div className="cabecalho-pagina">
        <h1>{evento.titulo}</h1>
        <Link className="btn" to="/events">
          Voltar
        </Link>
      </div>

      {erro && <p className="alert">{erro}</p>}

      <dl className="detalhes">
        <div>
          <dt>Local</dt>
          <dd>{evento.localizacao}</dd>
        </div>
        <div>
          <dt>Data</dt>
          <dd>{formatarDataHora(evento.data_evento)}</dd>
        </div>
        <div>
          <dt>Vagas</dt>
          <dd>
            <span className={vagasRestantes > 0 ? 'etiqueta' : 'etiqueta etiqueta--lotado'}>
              {inscritos.length} de {evento.max_voluntarios}
              {vagasRestantes <= 0 && ' · Lotado'}
            </span>
          </dd>
        </div>
        {evento.descricao && (
          <div>
            <dt>Descrição</dt>
            <dd>{evento.descricao}</dd>
          </div>
        )}
      </dl>

      {ehAdmin && (
        <div className="secao">
          <h2>Inscrever voluntário</h2>
          <form onSubmit={inscrever} className="form form--grade" noValidate>
            <FormSelect
              label="Voluntário"
              name="voluntario_id"
              value={voluntarioId}
              onChange={selecionarVoluntario}
              erro={erroSelecao}
              required
            >
              <option value="">Selecione...</option>
              {disponiveis.map((voluntario) => (
                <option key={voluntario.id} value={voluntario.id}>
                  {voluntario.nome} ({voluntario.email})
                </option>
              ))}
            </FormSelect>
            <Button type="submit">Inscrever</Button>
          </form>
        </div>
      )}

      <div className="secao">
        <h2>Inscritos ({inscritos.length})</h2>

        {inscritos.length === 0 && <p>Nenhum voluntário inscrito.</p>}

        {inscritos.length > 0 && (
          <div className="tabela-wrapper">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Inscrito em</th>
                  {ehAdmin && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {inscritos.map((inscrito) => (
                  <tr key={inscrito.id}>
                    <td>{inscrito.nome}</td>
                    <td>{inscrito.email}</td>
                    <td>{inscrito.telefone ? mascararTelefone(inscrito.telefone) : '—'}</td>
                    <td>{formatarDataHora(inscrito.inscrito_em)}</td>
                    {ehAdmin && (
                      <td className="acoes">
                        <Button variante="perigo" onClick={() => cancelar(inscrito)}>
                          Cancelar inscrição
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
