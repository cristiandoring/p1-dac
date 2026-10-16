const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarioModel');
const AppError = require('../utils/AppError');

/**
 * Regras de negócio da autenticação.
 */
class AuthService {
  /**
   * Autentica um usuário e gera o token JWT.
   * @param {string} email - E-mail informado.
   * @param {string} senha - Senha informada.
   * @returns {Promise<{token: string, user: {email: string, role: string}}>} Token com payload
   *   { email, role } e os dados do usuário.
   * @throws {AppError} 400 se faltar dado; 401 se as credenciais forem inválidas.
   */
  static async login(email, senha) {
    if (typeof email !== 'string' || typeof senha !== 'string' || !email || !senha) {
      throw new AppError('Informe e-mail e senha.');
    }

    const usuario = await UsuarioModel.buscarPorEmail(email);
    const senhaCorreta = usuario && (await bcrypt.compare(senha, usuario.senha_hash));

    if (!senhaCorreta) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    const token = jwt.sign({ email: usuario.email, role: usuario.perfil }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    return { token, user: { email: usuario.email, role: usuario.perfil } };
  }
}

module.exports = AuthService;
