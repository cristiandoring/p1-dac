const DashboardService = require('../services/dashboardService');

/**
 * Recebe as requisições HTTP do painel e delega ao service.
 */
class DashboardController {
  /**
   * GET /dashboard - Exibe o painel do usuário autenticado.
   * @param {import('express').Request} req - Requisição com req.usuario preenchido pela autenticação.
   * @param {import('express').Response} res - Resposta 200 com o resumo e os eventos.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async exibir(req, res, next) {
    try {
      const painel = await DashboardService.obterPainel(req.usuario);
      res.status(200).json({
        mensagem: 'Painel carregado com sucesso.',
        ...painel,
      });
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = DashboardController;
