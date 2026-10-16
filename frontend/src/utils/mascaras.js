/** Remove tudo que não for dígito. */
export function apenasDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

/** Formata como (99) 9999-9999 ou (99) 99999-9999 enquanto o usuário digita. */
export function mascararTelefone(valor) {
  const digitos = apenasDigitos(valor).slice(0, 11);

  if (digitos.length === 0) return '';
  if (digitos.length <= 2) return `(${digitos}`;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

/** Mantém apenas dígitos, até 4 posições (usado no limite de voluntários). */
export function mascararInteiro(valor) {
  return apenasDigitos(valor).slice(0, 4);
}
