
const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Autenticação e geração de token JWT
 */

/**
 * @swagger
 * /v1/user/token:
 *   post:
 *     summary: Realizar login
 *     description: Autentica um usuário e retorna um token JWT.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT de autenticação
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais incorretas
 */
router.post('/user/token', (req, res) => {
    return authController.login(req, res);
});

module.exports = router;
