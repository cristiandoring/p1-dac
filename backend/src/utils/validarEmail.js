/**
 * Verifica se um texto tem formato de e-mail (texto@texto.texto).
 * @param {string} email - Valor a validar.
 * @returns {boolean} true se o formato for válido.
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && regex.test(email);
}

module.exports = validarEmail;