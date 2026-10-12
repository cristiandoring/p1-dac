/**
 * Erro da aplicação com código de status HTTP associado.
 */
class AppError extends Error {
  /**
   * @param {string} message - Mensagem enviada ao cliente.
   * @param {number} [statusCode=400] - Código de status HTTP.
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = AppError;