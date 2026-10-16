const db = require('../config/database');

/**
 * Acesso à tabela usuarios.
 */
class UsuarioModel {
  /**
   * @param {string} email - E-mail do usuário.
   * @returns {Promise<object|undefined>} O usuário, ou undefined se não existir.
   */
  static async buscarPorEmail(email) {
    const [linhas] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return linhas[0];
  }
}

module.exports = UsuarioModel;
