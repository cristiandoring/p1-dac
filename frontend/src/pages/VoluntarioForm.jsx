import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { http } from '../api/http';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { useFormulario } from '../hooks/useFormulario';
import { apenasDigitos, mascararTelefone } from '../utils/mascaras';
import { validarEmail, validarNome, validarTelefone } from '../utils/validacoes';

const VALORES_INICIAIS = { nome: '', email: '', telefone: '' };

function validarCampo(nome, valor) {
  switch (nome) {
    case 'nome':
      return validarNome(valor);
    case 'email':
      return validarEmail(valor);
    case 'telefone':
      return validarTelefone(valor);
    default:
      return '';
  }
}

export default function VoluntarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const { valores, erros, aoMudar, aoSair, validarTudo, preencher, definirErro } = useFormulario(
    VALORES_INICIAIS,
    validarCampo,
    { telefone: mascararTelefone },
  );
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Na edição, carrega o voluntário para preencher os campos
  useEffect(() => {
    if (!editando) {
      return;
    }
    http
      .get(`/volunteers/${id}`)
      .then(({ data }) =>
        preencher({
          nome: data.nome,
          email: data.email,
          telefone: mascararTelefone(data.telefone ?? ''),
        }),
      )
      .catch(() => setErro('Voluntário não encontrado.'));
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
      nome: valores.nome.trim(),
      email: valores.email.trim(),
      telefone: apenasDigitos(valores.telefone) || null,
    };

    try {
      if (editando) {
        await http.put(`/volunteers/${id}`, dados);
      } else {
        await http.post('/volunteers', dados);
      }
      navigate('/volunteers');
    } catch (falha) {
      const mensagem = falha.response?.data?.error ?? 'Não foi possível salvar o voluntário.';
      if (falha.response?.status === 409) {
        // Regra do service: o e-mail precisa ser único
        definirErro('email', mensagem);
        setErro('Corrija os campos destacados em vermelho.');
      } else {
        setErro(mensagem);
      }
      setEnviando(false);
    }
  }

  return (
    <section className="card">
      <h1>{editando ? 'Editar voluntário' : 'Novo voluntário'}</h1>

      {erro && <p className="alert">{erro}</p>}

      <form onSubmit={enviar} className="form form--grade" noValidate>
        <FormInput
          label="Nome"
          name="nome"
          maxLength={100}
          value={valores.nome}
          onChange={aoMudar}
          onBlur={aoSair}
          erro={erros.nome}
          required
        />
        <FormInput
          label="E-mail"
          type="email"
          name="email"
          maxLength={150}
          value={valores.email}
          onChange={aoMudar}
          onBlur={aoSair}
          erro={erros.email}
          required
        />
        <FormInput
          label="Telefone"
          type="tel"
          name="telefone"
          maxLength={15}
          placeholder="(54) 99999-0001"
          value={valores.telefone}
          onChange={aoMudar}
          onBlur={aoSair}
          erro={erros.telefone}
        />

        <Button type="submit" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </section>
  );
}
