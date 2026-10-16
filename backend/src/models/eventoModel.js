const db = require('../config/database');

/**
 * Acesso à tabela eventos.
 */
class EventoModel {
  /**
   * Lista todos os eventos, do mais próximo ao mais distante.
   * @returns {Promise<Array<object>>} Eventos cadastrados.
   */
  static async listarTodos() {
    const [linhas] = await db.query('SELECT * FROM eventos ORDER BY data_evento');
    return linhas;
  }

  /**
   * Busca um evento pelo id.
   * @param {number|string} id - Id do evento.
   * @returns {Promise<object|undefined>} O evento, ou undefined se não existir.
   */
  static async buscarPorId(id) {
    const [linhas] = await db.query('SELECT * FROM eventos WHERE id = ?', [id]);
    return linhas[0];
  }

  /**
   * Insere um novo evento.
   * @param {object} evento - Dados do evento.
   * @returns {Promise<number>} Id do evento criado.
   */
  static async criar(evento) {
    const { titulo, descricao, localizacao, data_evento, max_voluntarios } = evento;
    const [resultado] = await db.query(
      'INSERT INTO eventos (titulo, descricao, localizacao, data_evento, max_voluntarios) VALUES (?, ?, ?, ?, ?)',
      [titulo, descricao ?? null, localizacao, data_evento, max_voluntarios],
    );
    return resultado.insertId;
  }

  /**
   * Atualiza um evento existente.
   * @param {number|string} id - Id do evento.
   * @param {object} evento - Novos dados do evento.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  static async atualizar(id, evento) {
    const { titulo, descricao, localizacao, data_evento, max_voluntarios } = evento;
    const [resultado] = await db.query(
      'UPDATE eventos SET titulo = ?, descricao = ?, localizacao = ?, data_evento = ?, max_voluntarios = ? WHERE id = ?',
      [titulo, descricao ?? null, localizacao, data_evento, max_voluntarios, id],
    );
    return resultado.affectedRows;
  }

  /**
   * Remove um evento pelo id.
   * @param {number|string} id - Id do evento.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  static async excluir(id) {
    const [resultado] = await db.query('DELETE FROM eventos WHERE id = ?', [id]);
    return resultado.affectedRows;
  }
}

module.exports = EventoModel;
