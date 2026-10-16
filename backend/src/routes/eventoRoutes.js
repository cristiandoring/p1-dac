const express = require('express');
const EventoController = require('../controllers/eventoController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

const router = express.Router();
/**
 * @openapi
 * /events:
 *   get:
 *     tags: [Eventos]
 *     summary: Lista todos os eventos
 *     description: Rota pública. Os eventos vêm ordenados pela data.
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *   post:
 *     tags: [Eventos]
 *     summary: Cadastra um novo evento
 *     description: Exige token JWT de um usuário com perfil admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventoEntrada'
 *     responses:
 *       201:
 *         description: Evento criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       400:
 *         $ref: '#/components/responses/Invalido'
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 *       403:
 *         $ref: '#/components/responses/SemPermissao'
 */

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     tags: [Eventos]
 *     summary: Busca um evento pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id do evento
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       404:
 *         $ref: '#/components/responses/NaoEncontrado'
 */

router.get('/', EventoController.listar);
router.get('/:id', EventoController.buscarPorId);
router.post('/', autenticar, autorizar('admin'), EventoController.criar);
router.put('/:id', autenticar, autorizar('admin'), EventoController.atualizar);
router.delete('/:id', autenticar, autorizar('admin'), EventoController.excluir);

module.exports = router;
