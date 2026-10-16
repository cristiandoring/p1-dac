const VoluntarioService = require('../services/voluntarioService');

/**
 * Recebe as requisições HTTP de voluntários e delega ao service.
 */
class VoluntarioController {
  /**
   * GET /volunteers - Lista todos os voluntários.
   * @param {import('express').Request} req - Requisição HTTP.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async listar(req, res, next) {
    try {
      res.json(await VoluntarioService.listarVoluntarios());
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * GET /volunteers/:id - Busca um voluntário pelo id.
   * @param {import('express').Request} req - Requisição HTTP. O id vem em req.params.id.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async buscarPorId(req, res, next) {
    try {
      res.json(await VoluntarioService.buscarVoluntarioPorId(req.params.id));
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * POST /volunteers - Cadastra um voluntário (somente admin).
   * @param {import('express').Request} req - Requisição HTTP. Os dados vêm em req.body.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async criar(req, res, next) {
    try {
      const voluntario = await VoluntarioService.criarVoluntario(req.body);
      res.status(201).json({
        mensagem: 'Voluntário cadastrado com sucesso.',
        ...voluntario,
      });
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * PUT /volunteers/:id - Atualiza um voluntário (somente admin).
   * @param {import('express').Request} req - Requisição HTTP. O id vem em req.params.id e os dados em req.body.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async atualizar(req, res, next) {
    try {
      const voluntario = await VoluntarioService.atualizarVoluntario(req.params.id, req.body);
      res.status(200).json({
        mensagem: 'Voluntário atualizado com sucesso.',
        ...voluntario,
      });
    } catch (erro) {
      next(erro);
    }
  }

  /**
   * DELETE /volunteers/:id - Exclui um voluntário (somente admin).
   * @param {import('express').Request} req - Requisição HTTP. O id vem em req.params.id.
   * @param {import('express').Response} res - Resposta HTTP.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async excluir(req, res, next) {
    try {
      await VoluntarioService.excluirVoluntario(req.params.id);
      res.status(200).json({ mensagem: 'Voluntário excluído com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = VoluntarioController;
