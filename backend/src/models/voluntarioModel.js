const db = require('../config/database');

/**
 * Acesso à tabela voluntarios.
 */
class VoluntarioModel {
  /**
   * @returns {Promise<Array<object>>} Todos os voluntários, em ordem alfabética.
   */
  static async listarTodos() {
    const [linhas] = await db.query('SELECT * FROM voluntarios ORDER BY nome');
    return linhas;
  }

  /**
   * @param {number|string} id - Id do voluntário.
   * @returns {Promise<object|undefined>} O voluntário, ou undefined se não existir.
   */
  static async buscarPorId(id) {
    const [linhas] = await db.query('SELECT * FROM voluntarios WHERE id = ?', [id]);
    return linhas[0];
  }

  /**
   * @param {string} email - E-mail do voluntário.
   * @returns {Promise<object|undefined>} O voluntário, ou undefined se não existir.
   */
  static async buscarPorEmail(email) {
    const [linhas] = await db.query('SELECT * FROM voluntarios WHERE email = ?', [email]);
    return linhas[0];
  }

  /**
   * @param {object} voluntario - Dados do voluntário.
   * @returns {Promise<number>} Id do voluntário criado.
   */
  static async criar(voluntario) {
    const { nome, email, telefone } = voluntario;
    const [resultado] = await db.query(
      'INSERT INTO voluntarios (nome, email, telefone) VALUES (?, ?, ?)',
      [nome, email, telefone ?? null],
    );
    return resultado.insertId;
  }

  /**
   * @param {number|string} id - Id do voluntário.
   * @param {object} voluntario - Novos dados.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  static async atualizar(id, voluntario) {
    const { nome, email, telefone } = voluntario;
    const [resultado] = await db.query(
      'UPDATE voluntarios SET nome = ?, email = ?, telefone = ? WHERE id = ?',
      [nome, email, telefone ?? null, id],
    );
    return resultado.affectedRows;
  }

  /**
   * @param {number|string} id - Id do voluntário.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  static async excluir(id) {
    const [resultado] = await db.query('DELETE FROM voluntarios WHERE id = ?', [id]);
    return resultado.affectedRows;
  }
}

module.exports = VoluntarioModel;