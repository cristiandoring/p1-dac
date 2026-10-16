const EventoService = require('../services/eventoService');

/**
 * Recebe as requisições HTTP de eventos e delega ao service.
 */
class EventoController {
  /**
   * GET /events - Lista todos os eventos.
   * @param {import('express').Request} req - Requisição HTTP.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async listar(req, res, next) {
    try {
      res.json(await EventoService.listarEventos());
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * GET /events/:id - Busca um evento pelo id.
   * @param {import('express').Request} req - Requisição HTTP. O id vem em req.params.id.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async buscarPorId(req, res, next) {
    try {
      res.json(await EventoService.buscarEventoPorId(req.params.id));
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * POST /events - Cadastra um evento (somente admin).
   * @param {import('express').Request} req - Requisição HTTP. Os dados vêm em req.body.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async criar(req, res, next) {
    try {
      const evento = await EventoService.criarEvento(req.body);
      res.status(201).json({
        mensagem: 'Evento criado com sucesso.',
        ...evento,
      });
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * PUT /events/:id - Atualiza um evento (somente admin).
   * @param {import('express').Request} req - Requisição HTTP. O id vem em req.params.id e os dados em req.body.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async atualizar(req, res, next) {
    try {
      const evento = await EventoService.atualizarEvento(req.params.id, req.body);
      res.status(200).json({
        mensagem: 'Evento atualizado com sucesso.',
        ...evento,
      });
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * DELETE /events/:id - Exclui um evento (somente admin).
   * @param {import('express').Request} req - Requisição HTTP. O id vem em req.params.id.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async excluir(req, res, next) {
    try {
      await EventoService.excluirEvento(req.params.id);
      res.status(200).json({ mensagem: 'Evento excluído com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = EventoController;
