const InscricaoService = require('../services/inscricaoService');

/**
 * Recebe as requisições HTTP de inscrições e delega ao service.
 */
class InscricaoController {
  /** GET /events/:eventoId/volunteers */
  static async listar(req, res, next) {
    try {
      res.json(await InscricaoService.listarInscritos(req.params.eventoId));
    } catch (erro) {
      next(erro);
    }
  }

  /** POST /events/:eventoId/volunteers */
  static async inscrever(req, res, next) {
    try {
      const inscricao = await InscricaoService.inscrever(
        req.params.eventoId,
        req.body.voluntario_id,
      );
      res.status(201).json(inscricao);
    } catch (erro) {
      next(erro);
    }
  }

  /** DELETE /events/:eventoId/volunteers/:voluntarioId */
  static async cancelar(req, res, next) {
    try {
      await InscricaoService.cancelar(req.params.eventoId, req.params.voluntarioId);
      res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = InscricaoController;