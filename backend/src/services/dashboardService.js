const DashboardModel = require('../models/dashboardModel');

/**
 * Anexa a cada evento a lista de voluntários inscritos nele.
 * @param {Array<object>} eventos - Eventos com seus totais.
 * @param {Array<object>} inscricoes - Inscrições, cada uma com evento_id, voluntario_id e nome.
 * @returns {Array<object>} Eventos com o campo inscritos ({ id, nome }).
 */
function anexarInscritos(eventos, inscricoes) {
  return eventos.map((evento) => ({
    ...evento,
    inscritos: inscricoes
      .filter((inscricao) => inscricao.evento_id === evento.id)
      .map((inscricao) => ({ id: inscricao.voluntario_id, nome: inscricao.nome })),
  }));
}

/**
 * Regras de negócio do painel.
 */
class DashboardService {
  /**
   * @param {{email: string, role: string}} usuario - Usuário autenticado.
   * @returns {Promise<object>} Saudação, dados do usuário, totais e eventos com seus inscritos.
   */
  static async obterPainel(usuario) {
    const [resumo, eventos, inscricoes] = await Promise.all([
      DashboardModel.obterResumo(),
      DashboardModel.listarEventosComTotais(),
      DashboardModel.listarInscritos(),
    ]);

    return {
      mensagem: `Bem-vindo, ${usuario.email}.`,
      usuario,
      resumo,
      eventos: anexarInscritos(eventos, inscricoes),
    };
  }
}

module.exports = DashboardService;
