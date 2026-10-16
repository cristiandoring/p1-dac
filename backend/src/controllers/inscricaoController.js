const InscricaoService = require('../services/inscricaoService');

/**
 * Recebe as requisições HTTP de inscrições e delega ao service.
 */
class InscricaoController {
  /**
   * GET /events/:eventoId/volunteers - Lista os inscritos de um evento.
   * @param {import('express').Request} req - Requisição HTTP. O evento vem em req.params.eventoId.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async listar(req, res, next) {
    try {
      res.json(await InscricaoService.listarInscritos(req.params.eventoId));
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * POST /events/:eventoId/volunteers - Inscreve um voluntário (somente admin).
   * @param {import('express').Request} req - Requisição HTTP. O evento vem em req.params.eventoId e { voluntario_id } em req.body.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async inscrever(req, res, next) {
    try {
      const inscricao = await InscricaoService.inscrever(
        req.params.eventoId,
        req.body.voluntario_id,
      );
      res.status(201).json({
        mensagem: 'Inscrição realizada com sucesso.',
        ...inscricao,
      });
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * DELETE /events/:eventoId/volunteers/:voluntarioId - Cancela uma inscrição (somente admin).
   * @param {import('express').Request} req - Requisição HTTP. Os ids vêm em req.params.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async cancelar(req, res, next) {
    try {
      await InscricaoService.cancelar(req.params.eventoId, req.params.voluntarioId);
      res.status(200).json({ mensagem: 'Inscrição cancelada com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = InscricaoController;
