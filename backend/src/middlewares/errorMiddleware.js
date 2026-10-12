// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (statusCode === 500) {
    console.error('[ERRO]:', err.stack);
  }

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Erro interno no servidor.' : err.message,
    status: statusCode,
  });
}

module.exports = errorMiddleware;