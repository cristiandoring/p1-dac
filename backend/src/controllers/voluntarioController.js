const VoluntarioService = require('../services/voluntarioService');

/**
 * Recebe as requisições HTTP de voluntários e delega ao service.
 */
class VoluntarioController {
  /** GET /volunteers */
  static async listar(req, res, next) {
    try {
      res.json(await VoluntarioService.listarVoluntarios());
    } catch (erro) {
      next(erro);
    }
  }

  /** GET /volunteers/:id */
  static async buscarPorId(req, res, next) {
    try {
      res.json(await VoluntarioService.buscarVoluntarioPorId(req.params.id));
    } catch (erro) {
      next(erro);
    }
  }

  /** POST /volunteers */
  static async criar(req, res, next) {
    try {
      const voluntario = await VoluntarioService.criarVoluntario(req.body);
      res.status(201).json(voluntario);
    } catch (erro) {
      next(erro);
    }
  }

  /** PUT /volunteers/:id */
  static async atualizar(req, res, next) {
    try {
      const voluntario = await VoluntarioService.atualizarVoluntario(req.params.id, req.body);
      res.json(voluntario);
    } catch (erro) {
      next(erro);
    }
  }

  /** DELETE /volunteers/:id */
  static async excluir(req, res, next) {
    try {
      await VoluntarioService.excluirVoluntario(req.params.id);
      res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = VoluntarioController;