const EventoService = require('../services/eventoService');

/**
 * Recebe as requisições HTTP de eventos e delega ao service.
 */
class EventoController {
  /** GET /events */
  static async listar(req, res, next) {
    try {
      res.json(await EventoService.listarEventos());
    } catch (erro) {
      next(erro);
    }
  }

  /** GET /events/:id */
  static async buscarPorId(req, res, next) {
    try {
      res.json(await EventoService.buscarEventoPorId(req.params.id));
    } catch (erro) {
      next(erro);
    }
  }

  /** POST /events */
  static async criar(req, res, next) {
    try {
      const evento = await EventoService.criarEvento(req.body);
      res.status(201).json(evento);
    } catch (erro) {
      next(erro);
    }
  }

  /** PUT /events/:id */
  static async atualizar(req, res, next) {
    try {
      const evento = await EventoService.atualizarEvento(req.params.id, req.body);
      res.json(evento);
    } catch (erro) {
      next(erro);
    }
  }

  /** DELETE /events/:id */
  static async excluir(req, res, next) {
    try {
      await EventoService.excluirEvento(req.params.id);
      res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = EventoController;