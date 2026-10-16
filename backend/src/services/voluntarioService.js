const VoluntarioModel = require('../models/voluntarioModel');
const AppError = require('../utils/AppError');
const validarEmail = require('../utils/validarEmail');

/**
 * Valida os campos obrigatórios de um voluntário.
 * @param {object} voluntario - Dados do voluntário.
 * @throws {AppError} Se nome ou e-mail forem inválidos.
 */
function validarDadosVoluntario({ nome, email }) {
  if (!nome) {
    throw new AppError('O nome é obrigatório.');
  }
  if (!validarEmail(email)) {
    throw new AppError('Formato de e-mail inválido.');
  }
}

/**
 * Garante que o e-mail não pertence a outro voluntário.
 * @param {string} email - E-mail a verificar.
 * @param {number|string} [idAtual] - Id do voluntário que está sendo editado, se houver.
 * @throws {AppError} 409 se o e-mail já estiver em uso por outro voluntário.
 */
async function garantirEmailDisponivel(email, idAtual) {
  const existente = await VoluntarioModel.buscarPorEmail(email);
  const pertenceAOutro = existente && String(existente.id) !== String(idAtual);
  if (pertenceAOutro) {
    throw new AppError('E-mail já cadastrado.', 409);
  }
}

/**
 * Regras de negócio dos voluntários.
 */
class VoluntarioService {
  /**
   * @returns {Promise<Array<object>>} Todos os voluntários.
   */
  static async listarVoluntarios() {
    return VoluntarioModel.listarTodos();
  }

  /**
   * @param {number|string} id - Id do voluntário.
   * @returns {Promise<object>} O voluntário encontrado.
   * @throws {AppError} 404 se não existir.
   */
  static async buscarVoluntarioPorId(id) {
    const voluntario = await VoluntarioModel.buscarPorId(id);
    if (!voluntario) {
      throw new AppError('Voluntário não encontrado.', 404);
    }
    return voluntario;
  }

  /**
   * @param {object} dados - Dados do novo voluntário.
   * @returns {Promise<object>} O voluntário criado.
   */
  static async criarVoluntario(dados) {
    validarDadosVoluntario(dados);
    await garantirEmailDisponivel(dados.email);
    const id = await VoluntarioModel.criar(dados);
    return VoluntarioModel.buscarPorId(id);
  }

  /**
   * @param {number|string} id - Id do voluntário.
   * @param {object} dados - Novos dados.
   * @returns {Promise<object>} O voluntário atualizado.
   */
  static async atualizarVoluntario(id, dados) {
    await VoluntarioService.buscarVoluntarioPorId(id);
    validarDadosVoluntario(dados);
    await garantirEmailDisponivel(dados.email, id);
    await VoluntarioModel.atualizar(id, dados);
    return VoluntarioModel.buscarPorId(id);
  }

  /**
   * @param {number|string} id - Id do voluntário.
   * @throws {AppError} 404 se não existir.
   */
  static async excluirVoluntario(id) {
    await VoluntarioService.buscarVoluntarioPorId(id);
    await VoluntarioModel.excluir(id);
  }
}

module.exports = VoluntarioService;
