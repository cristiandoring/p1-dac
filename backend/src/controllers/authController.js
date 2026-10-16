const AuthService = require('../services/authService');

/**
 * Recebe as requisições HTTP de autenticação e delega ao service.
 */
class AuthController {
  /**
   * POST /auth/login - Autentica o usuário e devolve o token JWT.
   * @param {import('express').Request} req - Requisição com { email, senha } no corpo.
   * @param {import('express').Response} res - Resposta 200 com { mensagem, token, user }.
   * @param {import('express').NextFunction} next - Encaminha erros ao middleware de erros.
   * @returns {Promise<void>}
   */
  static async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const resultado = await AuthService.login(email, senha);
      res.status(200).json({
        mensagem: 'Login realizado com sucesso.',
        ...resultado,
      });
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = AuthController;
