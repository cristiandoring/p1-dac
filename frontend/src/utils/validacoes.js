import { apenasDigitos } from './mascaras';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_NOME = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
// DDD + celular (9 + 8 dígitos) ou DDD + fixo (2 a 5 + 7 dígitos)
const REGEX_TELEFONE = /^[1-9][1-9](?:9\d{8}|[2-5]\d{7})$/;

function iniciarComMaiuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function validarTexto(valor, { rotulo, min = 0, max = Infinity, obrigatorio = false }) {
  const texto = valor.trim();

  if (!texto) return obrigatorio ? `Informe ${rotulo}.` : '';
  if (texto.length < min) {
    return `${iniciarComMaiuscula(rotulo)} deve ter pelo menos ${min} caracteres.`;
  }
  if (texto.length > max) {
    return `${iniciarComMaiuscula(rotulo)} deve ter no máximo ${max} caracteres.`;
  }
  return '';
}

export function validarNome(valor) {
  const nome = valor.trim();

  if (!nome) return 'Informe o nome.';
  if (nome.length < 2) return 'O nome deve ter pelo menos 2 caracteres.';
  if (nome.length > 100) return 'O nome deve ter no máximo 100 caracteres.';
  if (!REGEX_NOME.test(nome)) {
    return 'O nome deve conter apenas letras, espaços, hífen ou apóstrofo.';
  }
  return '';
}

export function validarEmail(valor) {
  const email = valor.trim();

  if (!email) return 'Informe o e-mail.';
  if (email.length > 150) return 'O e-mail deve ter no máximo 150 caracteres.';
  if (!REGEX_EMAIL.test(email)) return 'Informe um e-mail válido, como nome@exemplo.com.';
  return '';
}

export function validarSenha(valor) {
  return valor ? '' : 'Informe a senha.';
}

export function validarTelefone(valor) {
  const digitos = apenasDigitos(valor);

  if (!digitos) return ''; // o telefone é opcional
  if (!REGEX_TELEFONE.test(digitos)) {
    return 'Informe um telefone válido com DDD, como (54) 99999-0001.';
  }
  return '';
}

export function validarDataEvento(valor, { exigirFutura }) {
  if (!valor) return 'Informe a data e a hora do evento.';

  const data = new Date(valor);
  if (Number.isNaN(data.getTime()) || data.getFullYear() > 2100) {
    return 'Data e hora inválidas.';
  }
  if (exigirFutura && data <= new Date()) {
    return 'A data do evento deve ser futura.';
  }
  return '';
}

export function validarLimiteVoluntarios(valor) {
  if (!valor) return 'Informe o limite de voluntários.';

  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 1) return 'O limite deve ser de no mínimo 1.';
  if (numero > 1000) return 'O limite máximo é de 1000 voluntários.';
  return '';
}
