import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { useFormulario } from '../hooks/useFormulario';
import { validarEmail, validarSenha } from '../utils/validacoes';

function validarCampo(nome, valor) {
  if (nome === 'email') return validarEmail(valor);
  if (nome === 'senha') return validarSenha(valor);
  return '';
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { valores, erros, aoMudar, aoSair, validarTudo } = useFormulario(
    { email: '', senha: '' },
    validarCampo,
  );
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setErro('');

    if (!validarTudo()) {
      setErro('Corrija os campos destacados em vermelho.');
      return;
    }

    setEnviando(true);
    try {
      await login({ email: valores.email.trim(), senha: valores.senha });
      navigate(state?.from?.pathname || '/dashboard', { replace: true });
    } catch (falha) {
      setErro(falha.response?.data?.error ?? 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="card">
      <h1>Login</h1>

      {erro && <p className="alert">{erro}</p>}

      <form onSubmit={enviar} className="form" noValidate>
        <FormInput
          label="E-mail"
          type="email"
          name="email"
          value={valores.email}
          placeholder="admin@ifrs.edu.br"
          onChange={aoMudar}
          onBlur={aoSair}
          erro={erros.email}
          required
        />
        <FormInput
          label="Senha"
          type="password"
          name="senha"
          value={valores.senha}
          placeholder="••••••"
          onChange={aoMudar}
          onBlur={aoSair}
          erro={erros.senha}
          required
        />
        <Button type="submit" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </section>
  );
}
