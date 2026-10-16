const db = require('../config/database');

/**
 * Consultas agregadas para o painel.
 */
class DashboardModel {
  /**
   * @returns {Promise<object>} Totais de eventos, voluntários e inscrições.
   */
  static async obterResumo() {
    const [linhas] = await db.query(
      `SELECT
         (SELECT COUNT(*) FROM eventos) AS total_eventos,
         (SELECT COUNT(*) FROM voluntarios) AS total_voluntarios,
         (SELECT COUNT(*) FROM inscricoes) AS total_inscricoes`,
    );
    return linhas[0];
  }

  /**
   * Lista os eventos com o número de inscritos em cada um.
   * O LEFT JOIN mantém na lista os eventos que ainda não têm inscritos.
   * @returns {Promise<Array<object>>} Eventos ordenados pela data, com total_inscritos.
   */
  static async listarEventosComTotais() {
    const [linhas] = await db.query(
      `SELECT e.id, e.titulo, e.data_evento, e.max_voluntarios,
              COUNT(i.voluntario_id) AS total_inscritos
       FROM eventos e
       LEFT JOIN inscricoes i ON i.evento_id = e.id
       GROUP BY e.id, e.titulo, e.data_evento, e.max_voluntarios
       ORDER BY e.data_evento`,
    );
    return linhas;
  }

  /**
   * Lista todas as inscrições com o nome do voluntário inscrito.
   * @returns {Promise<Array<{evento_id: number, voluntario_id: number, nome: string}>>}
   */
  static async listarInscritos() {
    const [linhas] = await db.query(
      `SELECT i.evento_id, v.id AS voluntario_id, v.nome
       FROM inscricoes i
       JOIN voluntarios v ON v.id = i.voluntario_id
       ORDER BY v.nome`,
    );
    return linhas;
  }
}

module.exports = DashboardModel;
