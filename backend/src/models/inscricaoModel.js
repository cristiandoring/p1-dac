const db = require('../config/database');

/**
 * Acesso à tabela inscricoes (ligação entre eventos e voluntários).
 */
class InscricaoModel {
  /**
   * Lista os voluntários inscritos em um evento.
   * @param {number|string} eventoId - Id do evento.
   * @returns {Promise<Array<object>>} Voluntários inscritos, com a data da inscrição.
   */
  static async listarVoluntariosDoEvento(eventoId) {
    const [linhas] = await db.query(
      `SELECT v.id, v.nome, v.email, v.telefone, i.criado_em AS inscrito_em
       FROM inscricoes i
       JOIN voluntarios v ON v.id = i.voluntario_id
       WHERE i.evento_id = ?
       ORDER BY i.criado_em`,
      [eventoId],
    );
    return linhas;
  }

  /**
   * Conta quantos voluntários estão inscritos em um evento.
   * @param {number|string} eventoId - Id do evento.
   * @returns {Promise<number>} Total de inscritos.
   */
  static async contarPorEvento(eventoId) {
    const [linhas] = await db.query(
      'SELECT COUNT(*) AS total FROM inscricoes WHERE evento_id = ?',
      [eventoId],
    );
    return linhas[0].total;
  }

  /**
   * Verifica se o voluntário já está inscrito no evento.
   * @param {number|string} eventoId - Id do evento.
   * @param {number|string} voluntarioId - Id do voluntário.
   * @returns {Promise<boolean>} true se já houver inscrição.
   */
  static async existe(eventoId, voluntarioId) {
    const [linhas] = await db.query(
      'SELECT 1 FROM inscricoes WHERE evento_id = ? AND voluntario_id = ? LIMIT 1',
      [eventoId, voluntarioId],
    );
    return linhas.length > 0;
  }

  /**
   * Registra a inscrição de um voluntário em um evento.
   * @param {number|string} eventoId - Id do evento.
   * @param {number|string} voluntarioId - Id do voluntário.
   * @returns {Promise<void>}
   */
  static async criar(eventoId, voluntarioId) {
    await db.query(
      'INSERT INTO inscricoes (evento_id, voluntario_id) VALUES (?, ?)',
      [eventoId, voluntarioId],
    );
  }

  /**
   * Remove a inscrição de um voluntário em um evento.
   * @param {number|string} eventoId - Id do evento.
   * @param {number|string} voluntarioId - Id do voluntário.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  static async excluir(eventoId, voluntarioId) {
    const [resultado] = await db.query(
      'DELETE FROM inscricoes WHERE evento_id = ? AND voluntario_id = ?',
      [eventoId, voluntarioId],
    );
    return resultado.affectedRows;
  }
}

module.exports = InscricaoModel;