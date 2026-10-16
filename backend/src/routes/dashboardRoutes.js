const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @openapi
 * /dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Exibe o painel do usuário autenticado
 *     description: Qualquer usuário autenticado acessa, seja admin ou comum.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Painel com dados do usuário e totais do sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Bem-vindo, admin@ifrs.edu.br.
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: admin
 *                 resumo:
 *                   type: object
 *                   properties:
 *                     total_eventos:
 *                       type: integer
 *                     total_voluntarios:
 *                       type: integer
 *                     total_inscricoes:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 */

router.get('/', autenticar, DashboardController.exibir);

module.exports = router;
