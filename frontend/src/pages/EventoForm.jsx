import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { http } from '../api/http';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { useFormulario } from '../hooks/useFormulario';
import { inputLocalParaMysql, isoParaInputLocal } from '../utils/datas';
import { mascararInteiro } from '../utils/mascaras';
import { validarDataEvento, validarLimiteVoluntarios, validarTexto } from '../utils/validacoes';

const VALORES_INICIAIS = {
  titulo: '',
  descricao: '',
  localizacao: '',
  data_evento: '',
  max_voluntarios: '',
};

export default function EventoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  function validarCampo(nome, valor) {
    switch (nome) {
      case 'titulo':
        return validarTexto(valor, { rotulo: 'o título', min: 3, max: 150, obrigatorio: true });
      case 'descricao':
        return validarTexto(valor, { rotulo: 'a descrição', max: 500 });
      case 'localizacao':
        return validarTexto(valor, {
          rotulo: 'a localização',
          min: 3,
          max: 150,
          obrigatorio: true,
        });
      case 'data_evento':
        // Ao criar, a data precisa ser futura; ao editar, um evento passado continua editável
        return validarDataEvento(valor, { exigirFutura: !editando });
      case 'max_voluntarios':
        return validarLimiteVoluntarios(valor);
      default:
        return '';
    }
  }

  const { valores, erros, aoMudar, aoSair, validarTudo, preencher, definirErro } = useFormulario(
    VALORES_INICIAIS,
    validarCampo,
    { max_voluntarios: mascararInteiro },
  );
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Na edição, carrega o evento para preencher os campos
  useEffect(() => {
    if (!editando) {
      return;
    }
    http
      .get(`/events/${id}`)
      .then(({ data }) =>
        preencher({
          titulo: data.titulo,
          descricao: data.descricao ?? '',
          localizacao: data.localizacao,
          data_evento: isoParaInputLocal(data.data_evento),
          max_voluntarios: String(data.max_voluntarios),
        }),
      )
      .catch(() => setErro('Evento não encontrado.'));
  }, [id, editando, preencher]);

  async function enviar(evento) {
    evento.preventDefault();
    setErro('');

    if (!validarTudo()) {
      setErro('Corrija os campos destacados em vermelho.');
      return;
    }

    setEnviando(true);
    const dados = {
      titulo: valores.titulo.trim(),
      descricao: valores.descricao.trim() || null,
      localizacao: valores.localizacao.trim(),
      data_evento: inputLocalParaMysql(valores.data_evento),
      max_voluntarios: Number(valores.max_voluntarios),
    };

    try {
      if (editando) {
        await http.put(`/events/${id}`, dados);
      } else {
        await http.post('/events', dados);
      }
      navigate('/events');
    } catch (falha) {
      const mensagem = falha.response?.data?.error ?? 'Não foi possível salvar o evento.';
      if (falha.response?.status === 409) {
        // Regra do service: o limite não pode ser menor que o número de inscritos
        definirErro('max_voluntarios', mensagem);
        setErro('Corrija os campos destacados em vermelho.');
      } else {
        setErro(mensagem);
      }
      setEnviando(false);
    }
  }

  return (
    <section className="card">
      <h1>{editando ? 'Editar evento' : 'Novo evento'}</h1>

      {erro && <p className="alert">{erro}</p>}

      <form onSubmit={enviar} className="form form--grade" noValidate>
        <FormInput
          label="Título"
          name="titulo"
          maxLength={150}
          value={valores.titulo}
          onChange={aoMudar}
          onBlur={aoSair}
          erro={erros.titulo}
          required
        />
        <FormInput
          label="Descrição"
          name="descricao"
          maxLength={500}
          value={valores.descricao}
          onChange={aoMudar}
          onBlur={aoSair}
          erro={erros.descricao}
        />
        <FormInput
          label="Localização"
          name="localizacao"
          maxLength={150}
          value={valores.localizacao}
          onChange={aoMudar}
          onBlur={aoSair}
          erro={erros.localizacao}
          required
        />
        <FormInput
          label="Data e hora"
          type="datetime-local"
          name="data_evento"
          value={valores.data_evento}
          onChange={aoMudar}
          onBlur={aoSair}
          erro={erros.data_evento}
          required
        />
        <FormInput
          label="Limite de voluntários"
          type="text"
          inputMode="numeric"
          name="max_voluntarios"
          placeholder="Ex.: 10"
          value={valores.max_voluntarios}
          onChange={aoMudar}
          onBlur={aoSair}
          erro={erros.max_voluntarios}
          required
        />

        <Button type="submit" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </section>
  );
}
