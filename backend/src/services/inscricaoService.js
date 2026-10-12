const InscricaoModel = require('../models/inscricaoModel');
const EventoService = require('./eventoService');
const VoluntarioService = require('./voluntarioService');
const AppError = require('../utils/AppError');

/**
 * Garante que o voluntário ainda não está inscrito no evento.
 * @throws {AppError} 409 se já houver inscrição.
 */
async function garantirNaoInscrito(eventoId, voluntarioId) {
  if (await InscricaoModel.existe(eventoId, voluntarioId)) {
    throw new AppError('Voluntário já inscrito neste evento.', 409);
  }
}

/**
 * Garante que o evento ainda tem vaga.
 * @param {object} evento - Evento com o campo max_voluntarios.
 * @throws {AppError} 409 se o limite de voluntários já foi atingido.
 */
async function garantirVagaDisponivel(evento) {
  const inscritos = await InscricaoModel.contarPorEvento(evento.id);
  if (inscritos >= evento.max_voluntarios) {
    throw new AppError('Evento lotado: o limite de voluntários foi atingido.', 409);
  }
}

/**
 * Regras de negócio das inscrições em eventos.
 */
class InscricaoService {
  /**
   * @param {number|string} eventoId - Id do evento.
   * @returns {Promise<Array<object>>} Voluntários inscritos no evento.
   * @throws {AppError} 404 se o evento não existir.
   */
  static async listarInscritos(eventoId) {
    await EventoService.buscarEventoPorId(eventoId);
    return InscricaoModel.listarVoluntariosDoEvento(eventoId);
  }

  /**
   * Inscreve um voluntário em um evento, respeitando o limite de vagas.
   * @param {number|string} eventoId - Id do evento.
   * @param {number} voluntarioId - Id do voluntário.
   * @returns {Promise<object>} Os ids da inscrição criada.
   * @throws {AppError} 400, 404 ou 409 conforme a regra violada.
   */
  static async inscrever(eventoId, voluntarioId) {
    if (!Number.isInteger(voluntarioId)) {
      throw new AppError('Informe voluntario_id como um número inteiro.');
    }
    const evento = await EventoService.buscarEventoPorId(eventoId);
    await VoluntarioService.buscarVoluntarioPorId(voluntarioId);
    await garantirNaoInscrito(eventoId, voluntarioId);
    await garantirVagaDisponivel(evento);

    await InscricaoModel.criar(eventoId, voluntarioId);
    return { evento_id: evento.id, voluntario_id: voluntarioId };
  }

  /**
   * Cancela a inscrição de um voluntário em um evento.
   * @param {number|string} eventoId - Id do evento.
   * @param {number|string} voluntarioId - Id do voluntário.
   * @throws {AppError} 404 se a inscrição não existir.
   */
  static async cancelar(eventoId, voluntarioId) {
    const removidas = await InscricaoModel.excluir(eventoId, voluntarioId);
    if (removidas === 0) {
      throw new AppError('Inscrição não encontrada.', 404);
    }
  }
}

module.exports = InscricaoService;