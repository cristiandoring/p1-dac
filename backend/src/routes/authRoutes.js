const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Autentica o usuário e devolve um token JWT
 *     description: O token carrega o payload com email e role, e expira conforme JWT_EXPIRES_IN.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginEntrada'
 *     responses:
 *       200:
 *         description: Login realizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       400:
 *         $ref: '#/components/responses/Invalido'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */

router.post('/login', AuthController.login);

module.exports = router;
