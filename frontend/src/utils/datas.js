function doisDigitos(numero) {
  return String(numero).padStart(2, '0');
}

/** Exibe uma data ISO como "10/11/2026 09:00", no horário local. */
export function formatarDataHora(iso) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

/** Converte a data ISO da API para o valor de um <input type="datetime-local">. */
export function isoParaInputLocal(iso) {
  const data = new Date(iso);
  const dia = `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
  const hora = `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
  return `${dia}T${hora}`;
}

/** Converte o valor de um <input type="datetime-local"> para o formato aceito pela API. */
export function inputLocalParaMysql(valor) {
  return `${valor.replace('T', ' ')}:00`;
}
