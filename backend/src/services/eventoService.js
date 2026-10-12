const EventoModel = require('../models/eventoModel');
const AppError = require('../utils/AppError');

/**
 * Valida os campos obrigatórios de um evento.
 * @param {object} evento - Dados do evento.
 * @throws {AppError} Se algum campo for inválido.
 */
function validarDadosEvento({ titulo, localizacao, data_evento, max_voluntarios }) {
  if (!titulo || !localizacao) {
    throw new AppError('Título e localização são obrigatórios.');
  }
  if (Number.isNaN(Date.parse(data_evento))) {
    throw new AppError('Data do evento inválida.');
  }
  if (!Number.isInteger(max_voluntarios) || max_voluntarios < 1) {
    throw new AppError('O limite de voluntários deve ser um inteiro maior que zero.');
  }
}

/**
 * Regras de negócio dos eventos.
 */
class EventoService {
  /**
   * @returns {Promise<Array<object>>} Todos os eventos.
   */
  static async listarEventos() {
    return EventoModel.listarTodos();
  }

  /**
   * @param {number|string} id - Id do evento.
   * @returns {Promise<object>} O evento encontrado.
   * @throws {AppError} 404 se o evento não existir.
   */
  static async buscarEventoPorId(id) {
    const evento = await EventoModel.buscarPorId(id);
    if (!evento) {
      throw new AppError('Evento não encontrado.', 404);
    }
    return evento;
  }

  /**
   * @param {object} dados - Dados do novo evento.
   * @returns {Promise<object>} O evento criado.
   */
  static async criarEvento(dados) {
    validarDadosEvento(dados);
    const id = await EventoModel.criar(dados);
    return EventoModel.buscarPorId(id);
  }

  /**
   * @param {number|string} id - Id do evento.
   * @param {object} dados - Novos dados do evento.
   * @returns {Promise<object>} O evento atualizado.
   * @throws {AppError} 404 se o evento não existir.
   */
  static async atualizarEvento(id, dados) {
    await EventoService.buscarEventoPorId(id);
    validarDadosEvento(dados);
    await EventoModel.atualizar(id, dados);
    return EventoModel.buscarPorId(id);
  }

  /**
   * @param {number|string} id - Id do evento.
   * @throws {AppError} 404 se o evento não existir.
   */
  static async excluirEvento(id) {
    await EventoService.buscarEventoPorId(id);
    await EventoModel.excluir(id);
  }
}

module.exports = EventoService;