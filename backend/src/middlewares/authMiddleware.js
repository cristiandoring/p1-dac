const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/**
 * Exige um token JWT válido no header Authorization (formato "Bearer <token>").
 * Em caso de sucesso, disponibiliza { email, role } em req.usuario.
 */
function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');

  if (tipo !== 'Bearer' || !token) {
    return next(new AppError('Token de autenticação não informado.', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.usuario = { email: payload.email, role: payload.role };
    return next();
  } catch {
    return next(new AppError('Token inválido ou expirado.', 401));
  }
}

/**
 * Cria um middleware que só deixa passar usuários com um dos papéis informados.
 * Deve ser usado depois de autenticar.
 * @param {...string} papeisPermitidos - Papéis aceitos, por exemplo 'admin'.
 */
function autorizar(...papeisPermitidos) {
  return (req, res, next) => {
    if (!papeisPermitidos.includes(req.usuario.role)) {
      return next(new AppError('Acesso negado: permissão insuficiente.', 403));
    }
    return next();
  };
}

module.exports = { autenticar, autorizar };
